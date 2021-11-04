// see: https://stripe.com/docs/api/coupons/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources, withSession } from '@duely/db';
import { DuelyGraphQLError } from '../../errors';
import stripe from '@duely/stripe';
import { createStripeRetrieveQueryResolver, withStripeAccountProperty } from '../../util';
import { timestampToDate } from '@duely/util';

export const Coupon: GqlTypeDefinition<
  Stripe.Coupon & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type Coupon {
      id: ID!
      id_ext: ID!
      amount_off: Int
      applies_to: CouponAppliesTo
      created: DateTime
      currency: String
      duration: String
      duration_in_months: Int
      livemode: Boolean
      max_redemptions: Int
      name: String
      percent_off: Int
      redeem_by: DateTime
      times_redeemed: Int
      valid: Boolean
    }

    type CouponAppliesTo {
      products: [String!]
    }

    input CouponAppliesToInput {
      products: [String!]
    }

    extend type Query {
      coupon(stripe_account_id: ID!, coupon_id: ID!): Coupon
    }

    extend type Mutation {
      create_coupon(
        stripe_account_id: ID!
        amount_off: Int
        currency: String
        percent_off: Int
        duration: String
        duration_in_months: Int
        name: String
        id: String
        applies_to: CouponAppliesToInput
        max_redemptions: Int
        redeem_by: Int
      ): CouponMutationResult!
      update_coupon(stripe_account_id: ID!, coupon_id: ID!, name: String): CouponMutationResult!
      delete_coupon(stripe_account_id: ID!, coupon_id: ID!): CouponMutationResult!
    }

    type CouponMutationResult implements MutationResult {
      success: Boolean!
      message: String
      coupon: Coupon
    }
  `,
  resolvers: {
    Coupon: {
      id_ext: (source) => source.id,
      created: (source) => timestampToDate(source.created),
      redeem_by: (source) => timestampToDate(source.redeem_by)
    },
    Query: {
      ...createStripeRetrieveQueryResolver({
        name: 'coupon',
        endpoint: 'coupons'
      })
    },
    Mutation: {
      async create_coupon(
        obj,
        { stripe_account_id, ...args }: { stripe_account_id: string } & Stripe.CouponCreateParams,
        context,
        info
      ) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            console.log('DEBUG - create_coupon - args: ', JSON.stringify(args));

            const coupon = await stripe.get(stripe_account).coupons.create(args);

            // success
            return {
              success: true,
              coupon,
              type: 'CouponMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CouponMutationResult'
          };
        }
      },
      async update_coupon(obj, { stripe_account_id, coupon_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const coupon = await stripe.get(stripe_account).coupons.update(coupon_id, args);

            // success
            return {
              success: true,
              coupon,
              type: 'CouponMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CouponMutationResult'
          };
        }
      },
      async delete_coupon(obj, { stripe_account_id, coupon_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const coupon = await stripe.get(stripe_account).coupons.del(coupon_id);

            // success
            return {
              success: true,
              coupon,
              type: 'CouponMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'CouponMutationResult'
          };
        }
      }
    }
  }
};
