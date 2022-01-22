import { withSession, Resources, queryResourceAccess } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  createStripeRetrieveResolverForReferencedResource
} from '../../util';
import stripe from '@duely/stripe';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { Currency, formatCurrency, timestampToDate } from '@duely/util';
import Stripe from 'stripe';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'price',
  table_name: 'price'
} as const;

export const Price: GqlTypeDefinition<Resources['price']> = {
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
        recurring_iterations: Int
        status: String
      ): PriceMutationResult!
      update_price(price_id: ID!, status: String!): PriceMutationResult!
      delete_price(price_id: ID!): PriceMutationResult!
    }

    type PriceMutationResult implements MutationResult {
      success: Boolean!
      message: String
      price: Price
    }

    type StripePrice {
      id: String!
      active: Boolean!
      billing_scheme: String!
      created: DateTime
      currency: String!
      livemode: Boolean!
      lookup_key: String
      nickname: String
      product: StripeProduct
      recurring: StripePriceRecurring
      tax_behavior: String
      tiers: [StripePriceTier!]
      tiers_mode: String
      transform_quantity: StripePriceTransformQuantity
      type: String!
      unit_amount: Int
      unit_amount_decimal: String
    }

    type StripePriceRecurring {
      aggregate_usage: String
      interval: String!
      interval_count: Int!
      trial_period_days: Int
      usage_type: String
    }

    type StripePriceTier {
      flat_amount: Int
      flat_amount_decimal: String
      unit_amount: Int
      unit_amount_decimal: String
      up_to: Int
    }

    type StripePriceTransformQuantity {
      divide_by: Int
      round: String
    }
  `,
  resolvers: {
    Price: {
      name(price) {
        return formatCurrency(price.unit_amount, price.currency as Currency);
      },
      ...createResolverForReferencedResource({ name: 'product' })
    },
    StripePrice: {
      created: (source: Stripe.Price) => timestampToDate(source.created),
      ...createStripeRetrieveResolverForReferencedResource({
        object: 'product',
        name: 'product',
        role: 'owner'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async create_price(
        obj,
        args: {
          product_id: string;
          unit_amount: number;
          currency: string;
          recurring_interval?: 'day' | 'week' | 'month' | 'year';
          recurring_interval_count?: number;
          recurring_iterations?: number;
          status?: string;
        },
        context,
        info
      ) {
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

              const agency = await queryResource('agency', product.agency_id);
              const stripe_account = await queryResource('stripe account', {
                livemode: agency.livemode,
                agency_id: agency.id
              });

              const access = await queryResourceAccess(context, stripe_account.id);

              if (access !== 'owner') {
                throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
              }

              const {
                unit_amount,
                currency,
                recurring_interval: interval,
                recurring_interval_count: interval_count,
                recurring_iterations: iterations
              } = args;

              const stripe_price_args: Stripe.PriceCreateParams = {
                product: product.id,
                unit_amount,
                currency
              };

              if (interval) {
                stripe_price_args.recurring = {
                  interval,
                  interval_count: interval_count ?? 1
                };
              }

              // create price object at stripe
              const stripe_price = await stripe
                .get(stripe_account)
                .prices.create(stripe_price_args);

              // create price resource
              let price = await createResource('price', { id: stripe_price.id, ...(args as any) });

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
            const stripe_account = await queryResource('stripe account', {
              livemode: agency.livemode,
              agency_id: agency.id
            });

            const access = await queryResourceAccess(context, stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            try {
              // try deactivate price at stripe
              await stripe.get(stripe_account).prices.update(price.id, { active: false });
            } catch (err: any) {
              // ignore error
              console.log(`Unable to deactivate price ${price.id} at Stripe`, err.message);
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
      }
    }
  }
};
