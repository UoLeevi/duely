import { withSession } from '@duely/db';
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
import { PriceResource, ProductResource } from '@duely/db/dist/types';

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
    }

    extend type Query {
      price(id: ID!): Price
      prices(filter: PriceFilter!): [Price!]
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
        if (!context.jwt) throw new Error('Unauthorized');

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
                  product[`stripe_prod_id_ext_${stripe_env}` as keyof ProductResource] ?? undefined;

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
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PriceMutationResult'
          };
        }
      },
      async update_price(obj, { price_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

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
        } catch (error) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PriceMutationResult'
          };
        }
      },
      async delete_price(obj, { price_id }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          return await withSession(context, async ({ queryResource, deleteResource }) => {
            const price = await deleteResource('price', price_id);

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
              } catch {
                // ignore error
              }
            }

            // success
            return {
              success: true,
              price,
              type: 'PriceMutationResult'
            };
          });
        } catch (error) {
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
        if (!context.jwt) throw new Error('Unauthorized');

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

            if (!success_url) {
              const product_thank_you_page_setting = await queryResource(
                'product thank you page setting',
                { product_id: product.id }
              );
              success_url = product_thank_you_page_setting?.url;
            }

            if (!success_url) {
              const agency_thank_you_page_setting = await queryResource(
                'agency thank you page setting',
                { agency_id: product.agency_id }
              );
              success_url = agency_thank_you_page_setting?.url;
            }

            if (!success_url) {
              success_url = `https://${subdomain.name}.duely.app/orders/thank-you`;
            }

            try {
              // validate and normalize url
              const url = new URL(success_url);
              url.searchParams.append('session_id', '{CHECKOUT_SESSION_ID}');
              success_url = url.href.replace('%7B', '{').replace('%7D', '}');
            } catch (error) {
              return {
                // error
                success: false,
                message: error.message,
                type: 'CreateStripeCheckoutSessionResult'
              };
            }

            if (!cancel_url) {
              cancel_url = context.referer ?? `https://${subdomain.name}.duely.app`;
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
              type: 'CreateStripeCheckoutSessionResult'
            };
          });
        } catch (error) {
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
