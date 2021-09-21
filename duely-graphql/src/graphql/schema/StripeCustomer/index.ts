// see: https://stripe.com/docs/api/customers/object

import { Resources } from '@duely/db';
import { timestampToDate } from '@duely/util';
import gql from 'graphql-tag';
import Stripe from 'stripe';
import { GqlTypeDefinition } from '../../types';
import { createResolverForReferencedResource } from '../../util';

export const StripeCustomer: GqlTypeDefinition<
  Stripe.Customer & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type StripeCustomer {
      id: ID!
      id_ext: ID!
      address: Address
      balance: Int
      created: DateTime
      currency: String
      delinquent: Boolean
      description: String
      email: String
      invoice_prefix: String
      name: String
      next_invoice_sequence: Int
      phone: String
      preferred_locales: [String]
      customer: Customer
    }
  `,
  resolvers: {
    StripeCustomer: {
      id_ext: (source) => source.id,
      created: (source) => timestampToDate(source.created),
      ...createResolverForReferencedResource({
        name: 'customer',
        reverse: true,
        reverse_column_name: 'email',
        column_name: 'email_address'
      })
    }
  }
};
