// see: https://stripe.com/docs/api/discounts/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources } from '@duely/db';
import stripe from '@duely/stripe';
import { withStripeAccountProperty } from '../../util';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';

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
      end: (source) => source.end && new Date(source.end * 1000),
      start: (source) => new Date(source.start * 1000),
      async customer(source, args, context, info) {
        if (source.customer == null) return null;
        if (typeof source.customer === 'object') return source.customer;

        const resolveTree = parseResolveInfo(info) as ResolveTree;
        const fields = Object.keys(Object.values(resolveTree.fieldsByTypeName)[0]);
        if (fields.length === 1 && fields[0] === 'id') return { id: source.customer };

        const customer = await stripe
          .get(source.stripe_account)
          .customers.retrieve(source.customer);
        return withStripeAccountProperty(customer, source.stripe_account);
      }
    }
  }
};
