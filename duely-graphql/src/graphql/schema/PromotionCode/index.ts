// see: https://stripe.com/docs/api/promotion_codes/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources, withSession } from '@duely/db';
import { DuelyGraphQLError } from '../../errors';
import stripe from '@duely/stripe';
import {
  createStripeListQueryResolver,
  createStripeRetrieveQueryResolver,
  withStripeAccountProperty
} from '../../util';
import { timestampToDate } from '@duely/util';

export const PromotionCode: GqlTypeDefinition<
  Stripe.PromotionCode & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type PromotionCode {
      id: ID!
      active: Boolean!
      code: String!
      coupon: Coupon!
      created: DateTime!
      customer: StripeCustomer
      expires_at: DateTime
      livemode: Boolean!
      max_redemptions: Int
      # metadata: Stripe.Metadata | null;

      restrictions: PromotionCodeRestrictions
      times_redeemed: Int!
    }

    type PromotionCodeRestrictions {
      first_time_transaction: Boolean!
      minimum_amount: Int
      minimum_amount_currency: String
    }

    input PromotionCodeRestrictionsInput {
      first_time_transaction: Boolean!
      minimum_amount: Int
      minimum_amount_currency: String
    }

    extend type Query {
      promotion_code(stripe_account_id: ID!, promotion_code_id: ID!): PromotionCode
      promotion_codes(
        stripe_account_id: ID!
        active: Boolean
        code: String
        coupon: String
        customer: String
        starting_after: String
        ending_before: String
        limit: Int
      ): [PromotionCode!]!
    }

    extend type Mutation {
      create_promotion_code(
        stripe_account_id: ID!
        coupon: String!
        active: Boolean
        code: String
        customer: String
        expires_at: Int
        max_redemptions: Int
        restrictions: PromotionCodeRestrictionsInput
      ): PromotionCodeMutationResult!
      update_promotion_code(
        stripe_account_id: ID!
        promotion_code_id: ID!
        active: Boolean
      ): PromotionCodeMutationResult!
    }

    type PromotionCodeMutationResult implements MutationResult {
      success: Boolean!
      message: String
      promotion_code: PromotionCode
    }
  `,
  resolvers: {
    PromotionCode: {
      created: (source) => timestampToDate(source.created),
      expires_at: (source) => timestampToDate(source.expires_at)
    },
    Query: {
      ...createStripeRetrieveQueryResolver({
        name: 'promotion_code',
        object: 'promotion_code'
      }),
      ...createStripeListQueryResolver({
        name: 'promotion_codes',
        object: 'promotion_code'
      })
    },
    Mutation: {
      async create_promotion_code(
        obj,
        {
          stripe_account_id,
          ...args
        }: { stripe_account_id: string } & Stripe.PromotionCodeCreateParams,
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

            const promotion_code = await stripe.get(stripe_account).promotionCodes.create(args);

            // success
            return {
              success: true,
              promotion_code,
              type: 'PromotionCodeMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PromotionCodeMutationResult'
          };
        }
      },
      async update_promotion_code(
        obj,
        { stripe_account_id, promotion_code_id, ...args },
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

            const promotion_code = await stripe
              .get(stripe_account)
              .promotionCodes.update(promotion_code_id, args);

            // success
            return {
              success: true,
              promotion_code,
              type: 'PromotionCodeMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'PromotionCodeMutationResult'
          };
        }
      }
    }
  }
};
