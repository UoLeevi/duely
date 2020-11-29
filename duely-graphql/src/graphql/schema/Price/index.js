import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource, createResolverForReferencedResource } from '../../util';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';
import stripe from '../../../stripe';

const resource = {
  name: 'price',
  table_name: 'price'
};

export const Price = {
  typeDef: `
    type Price implements Node {
      id: ID!
      name: String!
      status: String!
      type: String!
      unit_amount: Int!
      currency: String!
      recurring_interval: String
      recurring_interval_count: Int
      service_variant: ServiceVariant!
    }

    input PriceFilter {
      service_variant_id: ID
    }

    extend type Query {
      price(id: ID!): Price
      prices(filter: PriceFilter!): [Price!]
    }

    extend type Mutation {
      create_price(service_variant_id: ID!, unit_amount: Int!, currency: String!, recurring_interval: String, recurring_interval_count: Int, status: String): PriceMutationResult!
      update_price(price_id: ID!, status: String!): PriceMutationResult!
      delete_price(price_id: ID!): PriceMutationResult!
      create_stripe_checkout_session(price_id: ID!): CreateStripeCheckoutSessionResult!
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
      name: source => `${source.currency.toUpperCase()} ${source.unit_amount / 100}` + (source.type === 'recurring' ? ` / ${source.recurring_interval}` : '') + (source.recurring_interval_count ? `, ${source.recurring_interval_count} payments` : ''),
      ...createResolverForReferencedResource({ name: 'service_variant' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_price(obj, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ createResource, queryResource }) => {
              const service_variant = await queryResource(args.service_variant_id);

              if (service_variant == null) {
                throw Error('Service variant not found');
              }

              const { status, unit_amount, currency, recurring_interval: interval, recurring_interval_count: interval_count } = args;

              const stripe_price_args = {
                unit_amount,
                currency,
                product: service_variant.stripe_id_ext,
                active: status === 'live'
              };

              if (interval) {
                stripe_price_args.recurring = {
                  interval
                };

                if (interval_count) {
                  stripe_price_args.recurring.interval_count = interval_count;
                }
              }

              // create price object at stripe
              const stripe_price = await stripe.prices.create(stripe_price_args);

              // create price resource
              const price = await createResource('price', { ...args, stripe_id_ext: stripe_price.id });

              // success
              return {
                success: true,
                price,
                type: 'PriceMutationResult'
              };
            });
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
      async update_price(obj, { price_id, ...args }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ updateResource }) => {
              // update price resource
              const price = await updateResource(price_id, args);

              const { status } = price;

              const stripe_price_args = {
                active: status === 'live'
              };

              // update price object at stripe
              const stripe_price = await stripe.prices.update(price.stripe_id_ext, stripe_price_args);

              // success
              return {
                success: true,
                price,
                type: 'PriceMutationResult'
              };
            });
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
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ deleteResource }) => {
              const price = await deleteResource(price_id);

              try {
                // try deactivate price at stripe
                await stripe.prices.update(price.stripe_id_ext, { active: false });
              } catch {
                // ignore error
              }

              if (price == null) {
                return {
                  // error
                  success: false,
                  message: 'Price not found',
                  type: 'PriceMutationResult'
                };
              }

              // success
              return {
                success: true,
                price,
                type: 'PriceMutationResult'
              };
            });
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
      async create_stripe_checkout_session(obj, { price_id }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              // get resources
              const price = await queryResource(price_id);
              const service_variant = await queryResource(price.service_variant_id);
              const service = await queryResource(service_variant.service_id);
              const agency = await queryResource(service.agency_id);
              const stripe_account = await queryResource('stripe account', { agency_id: agency.id });
              const application_fee_percent = 4.5;

              // create stripe checkout session
              // see: https://stripe.com/docs/connect/creating-a-payments-page
              const stripe_checkout_session_args = {
                mode: price.type === 'recurring' ? 'subscription' : 'payment',
                payment_method_types: ['card'],
                line_items: [{
                  price: price.stripe_id_ext,
                  quantity: 1,
                }],
                success_url: 'https://duely.app/success',
                cancel_url: 'https://duely.app/failure',
              };

              if (price.type === 'recurring') {
                stripe_checkout_session_args.subscription_data = {
                  application_fee_percent
                };
              } else {
                stripe_checkout_session_args.payment_intent_data = {
                  application_fee_amount: Math.round(price.unit_amount * application_fee_percent / 100),
                };
              }

              const checkout_session = await stripe.checkout.sessions.create(
                stripe_checkout_session_args,
                { stripeAccount: stripe_account.stripe_id_ext });

              // success
              return {
                success: true,
                checkout_session_id: checkout_session.id,
                type: 'CreateStripeCheckoutSessionResult'
              };
            });
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
