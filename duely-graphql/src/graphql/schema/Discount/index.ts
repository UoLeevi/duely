// see: https://stripe.com/docs/api/discounts/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources } from '@duely/db';
import { timestampToDate } from '@duely/util';
import { createStripeRetrieveResolverForReferencedResource } from '../../util';

export const Discount: GqlTypeDefinition<
  Stripe.Discount & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type Discount {
      id: ID!
      id_ext: ID!
      checkout_session: String
      coupon: Coupon
      customer: StripeCustomer
      end: DateTime
      invoice: Invoice
      invoice_item: String
      promotion_code: String
      start: DateTime!
      subscription: String
    }
  `,
  resolvers: {
    Discount: {
      id_ext: (source) => source.id,
      end: (source) => timestampToDate(source.end),
      start: (source) => timestampToDate(source.start),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'customer',
        endpoint: 'customers'
      })
    }
  }
};
