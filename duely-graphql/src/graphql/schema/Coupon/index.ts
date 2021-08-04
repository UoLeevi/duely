// see: https://stripe.com/docs/api/coupons/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources } from '@duely/db';

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
  `,
  resolvers: {
    Coupon: {
      id_ext: (source) => source.id,
      created: (source) => new Date(source.created * 1000),
      redeem_by: (source) => new Date(source.created * 1000)
    }
  }
};
