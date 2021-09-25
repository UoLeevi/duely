// see: https://stripe.com/docs/api/customers/object

import { queryResourceAccess, Resources } from '@duely/db';
import stripe from '@duely/stripe';
import { timestampToDate } from '@duely/util';
import gql from 'graphql-tag';
import Stripe from 'stripe';
import { DuelyGraphQLError } from '../../errors';
import { GqlTypeDefinition } from '../../types';
import { createResolverForReferencedResource, withStripeAccountProperty } from '../../util';

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
      invoices(
        status: String
        subscription: ID
        collection_method: String
        due_date: DateTime
        created: DateTime
        starting_after_id: String
        ending_before_id: String
        limit: Int
      ): [Invoice!]!
      invoiceitems(
        invoice: ID
        pending: Boolean
        created: DateTime
        starting_after_id: String
        ending_before_id: String
        limit: Int
      ): [InvoiceItem!]!
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
      }),
      async invoices(source, { starting_after_id, ending_before_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const access = await queryResourceAccess(context, source.stripe_account.id);

          if (access !== 'owner') {
            throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
          }

          if (starting_after_id) {
            args.starting_after = starting_after_id;
          }

          if (ending_before_id) {
            args.ending_before = ending_before_id;
          }

          // see: https://stripe.com/docs/api/invoices/list
          const list = await stripe.get(source.stripe_account).invoices.list({
            customer: source.id,
            ...args
          });

          return withStripeAccountProperty(list.data, source.stripe_account);
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      async invoiceitems(source, { starting_after_id, ending_before_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const access = await queryResourceAccess(context, source.stripe_account.id);

          if (access !== 'owner') {
            throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
          }

          if (starting_after_id) {
            args.starting_after = starting_after_id;
          }

          if (ending_before_id) {
            args.ending_before = ending_before_id;
          }

          // see: https://stripe.com/docs/api/invoiceitems/list
          const list = await stripe.get(source.stripe_account).invoiceItems.list({
            customer: source.id,
            ...args
          });

          return withStripeAccountProperty(list.data, source.stripe_account);
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    }
  }
};
