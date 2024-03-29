// see: https://stripe.com/docs/api/customers/object

import { Resources } from '@duely/db';
import { timestampToDate } from '@duely/util';
import gql from 'graphql-tag';
import Stripe from 'stripe';
import { GqlTypeDefinition } from '../../types';
import {
  createResolverForReferencedResource,
  createStripeListResolverForReferencedResource
} from '../../util';

export const StripeCustomer: GqlTypeDefinition<
  Stripe.Customer & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type StripeCustomer {
      id: ID!
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
      payment_intents(
        customer: ID
        created: Int
        starting_after: String
        ending_before: String
        limit: Int
      ): [PaymentIntent!]!
      invoices(
        status: String
        subscription: ID
        collection_method: String
        due_date: Int
        created: Int
        starting_after: String
        ending_before: String
        limit: Int
      ): [Invoice!]!
      invoiceitems(
        invoice: ID
        pending: Boolean
        created: Int
        starting_after: String
        ending_before: String
        limit: Int
      ): [InvoiceItem!]!
      subscriptions(
        price: ID
        status: String
        collection_method: String
        created: Int
        current_period_start: TimeStampFilter
        current_period_end: TimeStampFilter
        starting_after: String
        ending_before: String
        limit: Int
      ): [StripeSubscription!]!
    }
  `,
  resolvers: {
    StripeCustomer: {
      created: (source) => timestampToDate(source.created),
      ...createResolverForReferencedResource({
        name: 'customer',
        reverse: true,
        reverse_column_name: 'email',
        column_name: 'email_address'
      }),
      ...createStripeListResolverForReferencedResource({
        name: 'payment_intents',
        object: 'payment_intent',
        param: 'customer',
        role: 'owner'
      }),
      ...createStripeListResolverForReferencedResource({
        name: 'invoices',
        object: 'invoice',
        param: 'customer',
        role: 'owner'
      }),
      ...createStripeListResolverForReferencedResource({
        name: 'invoiceitems',
        object: 'invoiceitem',
        param: 'customer',
        role: 'owner'
      }),
      ...createStripeListResolverForReferencedResource({
        name: 'subscriptions',
        object: 'subscription',
        param: 'customer',
        role: 'owner'
      })
    }
  }
};
