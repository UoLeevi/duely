import { withSession, PriceResource, ProductResource } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import stripe from '../../../stripe';
import { calculateTransactionFee } from '../SubscriptionPlan';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { Currency, Price as TPrice } from '@duely/core';
import Stripe from 'stripe';
import { URL } from 'url';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'price',
  table_name: 'price'
} as const;

export const Price: GqlTypeDefinition = {
  typeDef: gql`
    type Price implements Node {
      id: ID!
      name: String!
      status: String!
      active: Boolean!
      type: String!
      unit_amount: Int!
      currency: String!
      recurring_interval: String
      recurring_interval_count: Int
      product: Product!
    }

    input PriceFilter {
      product_id: ID
      stripe_price_id_ext_live: String
      stripe_price_id_ext_test: String
      type: String
      status: String
      active: Boolean
    }

    extend type Query {
      price(id: ID!): Price
      prices(
        filter: PriceFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Price!]
      count_prices(filter: PriceFilter!, token: String): Int!
    }

    extend type Mutation {
      create_price(
        product_id: ID!
        unit_amount: Int!
        currency: String!
        recurring_interval: String
        recurring_interval_count: Int
        status: String
      ): PriceMutationResult!
      update_price(price_id: ID!, status: String!): PriceMutationResult!
      delete_price(price_id: ID!): PriceMutationResult!
      create_stripe_checkout_session(
        price_id: ID!
        livemode: Boolean!
        success_url: String
        cancel_url: String
      ): CreateStripeCheckoutSessionResult!
    }

    type PriceMutationResult implements MutationResult {
      success: Boolean!
      message: String
      price: Price
    }

    type CreateStripeCheckoutSessionResult implements MutationResult {
      success: Boolean!
      message: String
      checkout_session_id: String
      checkout_session_url: String
    }
  `,
  resolvers: {
    Price: {
      name(price: TPrice) {
        return Currency.format(price.unit_amount, price.currency as Currency);
      },
      ...createResolverForReferencedResource({ name: 'product' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_price(obj, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(
            context,
            async ({ queryResource, createResource, updateResource }) => {
              const product = await queryResource('product', args.product_id);

              if (product == null) {
                throw Error('Product not found');
              }

              // create price resource
              let price = await createResource('price', args);

              const agency = await queryResource('agency', product.agency_id);

              const {
                unit_amount,
                currency,
                recurring_interval: interval,
                recurring_interval_count: interval_count
              } = args;

              const stripe_price_args: Stripe.PriceCreateParams = {
                unit_amount,
                currency
              };

              if (interval) {
                stripe_price_args.recurring = {
                  interval,
                  interval_count: interval_count ?? 1
                };
              }

              const stripe_price: Record<keyof typeof stripe, Stripe.Price | undefined> = {
                test: undefined,
                live: undefined
              };

              const stripe_envs: (keyof typeof stripe)[] = agency.livemode
                ? ['test', 'live']
                : ['test'];

              for (const stripe_env of stripe_envs) {
                const stripe_account = await queryResource('stripe account', {
                  agency_id: agency.id,
                  livemode: stripe_env === 'live'
                });

                stripe_price_args.product =
                  product[
                    `stripe_prod_id_ext_${stripe_env}` as
                      | 'stripe_prod_id_ext_live'
                      | 'stripe_prod_id_ext_test'
                  ] ?? undefined;

                // create price object at stripe
                stripe_price[stripe_env] = await stripe[stripe_env].prices.create(
                  stripe_price_args,
                  {
                    stripeAccount: stripe_account.stripe_id_ext
                  }
                );
              }

              // update price resource
              price = await updateResource('price', price.id, {
                stripe_price_id_ext_live: stripe_price.live?.id,
                stripe_price_id_ext_test: stripe_price.test?.id
              });

              // success
              return {
                success: true,
                price,
                type: 'PriceMutationResult'
              };
            }
          );
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PriceMutationResult'
          };
        }
      },
      async update_price(obj, { price_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ updateResource }) => {
            // update price resource
            const price = await updateResource('price', price_id, args);

            // success
            return {
              success: true,
              price,
              type: 'PriceMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PriceMutationResult'
          };
        }
      },
      async delete_price(obj, { price_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, updateResource }) => {
            const price = await updateResource('price', price_id, { active: false });

            if (price == null) {
              return {
                // error
                success: false,
                message: 'Price not found',
                type: 'PriceMutationResult'
              };
            }

            const product = await queryResource('product', price.product_id);
            const agency = await queryResource('agency', product.agency_id);

            const stripe_envs: (keyof typeof stripe)[] = agency.livemode
              ? ['test', 'live']
              : ['test'];

            for (const stripe_env of stripe_envs) {
              const stripe_account = await queryResource('stripe account', {
                agency_id: agency.id,
                livemode: stripe_env === 'live'
              });

              try {
                // try deactivate price at stripe
                await stripe[stripe_env].prices.update(
                  price[`stripe_price_id_ext_${stripe_env}` as keyof PriceResource] as string,
                  { active: false },
                  { stripeAccount: stripe_account.stripe_id_ext }
                );
              } catch (err: any) {
                // ignore error
                console.log(
                  `Unable to deactivate price ${
                    price[`stripe_price_id_ext_${stripe_env}` as keyof PriceResource] as string
                  } at Stripe (${stripe_env})`,
                  err.message
                );
              }
            }

            // success
            return {
              success: true,
              price,
              type: 'PriceMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PriceMutationResult'
          };
        }
      },
      async create_stripe_checkout_session(
        obj,
        { price_id, livemode, success_url, cancel_url },
        context,
        info
      ) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        const stripe_env = livemode ? 'live' : 'test';

        try {
          return await withSession(context, async ({ queryResource }) => {
            // get resources
            const price = await queryResource('price', price_id);
            const product = await queryResource('product', price.product_id);
            const stripe_account = await queryResource('stripe account', {
              agency_id: product.agency_id,
              livemode
            });
            const agency = await queryResource('agency', product.agency_id);
            const subdomain = await queryResource('subdomain', agency.subdomain_id);
            const product_settings = await queryResource('product settings', {
              product_id: product.id
            });
            const agency_settings = await queryResource('agency settings', {
              agency_id: product.agency_id
            });

            success_url =
              success_url ||
              product_settings?.checkout_success_url ||
              agency_settings?.checkout_success_url ||
              `https://${subdomain.name}.duely.app/orders/thank-you`;
              
            cancel_url =
              cancel_url ||
              product_settings?.checkout_cancel_url ||
              agency_settings?.checkout_cancel_url ||
              context.referer ||
              `https://${subdomain.name}.duely.app`;

            try {
              // validate and normalize url
              const success_url_obj = new URL(success_url);
              success_url_obj.searchParams.append('session_id', '{CHECKOUT_SESSION_ID}');
              success_url = success_url_obj.href.replace('%7B', '{').replace('%7D', '}');

              // validate and normalize url
              const cancel_url_obj = new URL(cancel_url);
              cancel_url_obj.searchParams.append('session_id', '{CHECKOUT_SESSION_ID}');
              cancel_url = cancel_url_obj.href.replace('%7B', '{').replace('%7D', '}');
            } catch (error: any) {
              return {
                // error
                success: false,
                message: error.message,
                type: 'CreateStripeCheckoutSessionResult'
              };
            }

            const application_fee_amount = await calculateTransactionFee(
              agency.subscription_plan_id,
              price.unit_amount,
              price.currency
            );

            // create stripe checkout session
            // see: https://stripe.com/docs/connect/creating-a-payments-page
            // see: https://stripe.com/docs/payments/checkout/custom-success-page
            // see: https://stripe.com/docs/api/checkout/sessions/create
            const stripe_checkout_session_args: Stripe.Checkout.SessionCreateParams = {
              mode: price.type === 'recurring' ? 'subscription' : 'payment',
              payment_method_types: ['card'],
              line_items: [
                {
                  price: price[
                    `stripe_price_id_ext_${stripe_env}` as keyof PriceResource
                  ] as string,
                  quantity: 1
                }
              ],
              success_url,
              cancel_url
            };

            if (price.type === 'recurring') {
              stripe_checkout_session_args.subscription_data = {
                application_fee_percent: (application_fee_amount / price.unit_amount) * 100
              };
            } else {
              stripe_checkout_session_args.payment_intent_data = {
                application_fee_amount
              };
            }

            const checkout_session = await stripe[stripe_env].checkout.sessions.create(
              stripe_checkout_session_args,
              {
                stripeAccount: stripe_account.stripe_id_ext
              }
            );

            // success
            return {
              success: true,
              checkout_session_id: checkout_session.id,
              checkout_session_url: checkout_session.url,
              type: 'CreateStripeCheckoutSessionResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CreateStripeCheckoutSessionResult'
          };
        }
      }
    }
  }
};
