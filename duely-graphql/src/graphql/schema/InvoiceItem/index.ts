// see: https://stripe.com/docs/api/invoiceitems

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources, withSession } from '@duely/db';
import { DuelyGraphQLError } from '../../errors';
import stripe from '@duely/stripe';
import { createStripeRetrieveQueryResolver, createStripeRetrieveResolverForReferencedResource, withStripeAccountProperty } from '../../util';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import { timestampToDate } from '@duely/util';

export const InvoiceItem: GqlTypeDefinition<
  Stripe.InvoiceItem & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type InvoiceItem {
      id: ID!
      id_ext: ID!
      amount: Int!
      currency: String!
      customer: StripeCustomer
      date: DateTime!
      description: String
      discountable: Boolean!
      discounts: [Discount!]
      invoice: Invoice
      livemode: Boolean!
      # metadata: Stripe.Metadata | null;

      # period: InvoiceItem.Period;

      price: StripePrice
      proration: Boolean!
      quantity: Int!
      # subscription: string | Stripe.Subscription | null;
      # subscription_item?: string;
      # tax_rates: Array<Stripe.TaxRate> | null;
      unit_amount: Int
      unit_amount_decimal: String
    }

    extend type Query {
      invoiceitem(stripe_account_id: ID!, invoiceitem_id: ID!): InvoiceItem
    }

    extend type Mutation {
      create_invoiceitem(
        stripe_account_id: ID!
        customer: ID!
        invoice: ID
        amount: Int
        currency: String
        description: String
        period: PeriodInput
        price: ID
        discountable: Boolean
        quantity: Int
        unit_amount: Int
        unit_amount_decimal: String
      ): InvoiceItemMutationResult!
      update_invoiceitem(
        stripe_account_id: ID!
        invoiceitem_id: ID!
        amount: Int
        description: String
        period: PeriodInput
        price: ID
        discountable: Boolean
        quantity: Int
        unit_amount: Int
        unit_amount_decimal: String
      ): InvoiceItemMutationResult!
      delete_invoiceitem(stripe_account_id: ID!, invoiceitem_id: ID!): InvoiceItemMutationResult!
    }

    input PeriodInput {
      start: Int!
      end: Int!
    }

    type InvoiceItemMutationResult implements MutationResult {
      success: Boolean!
      message: String
      invoiceitem: InvoiceItem
    }
  `,
  resolvers: {
    InvoiceItem: {
      id_ext: (source) => source.id,
      date: (source) => timestampToDate(source.date),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'customer',
        object: 'customer'
      }),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'invoice',
        object: 'invoice'
      })
    },
    Query: {
      ...createStripeRetrieveQueryResolver({
        name: 'invoiceitem',
        object: 'invoiceitem'
      })
    },
    Mutation: {
      async create_invoiceitem(
        obj,
        {
          stripe_account_id,
          ...args
        }: { stripe_account_id: string } & Stripe.InvoiceItemCreateParams,
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

            const invoiceitem = await stripe.get(stripe_account).invoiceItems.create(args);

            // success
            return {
              success: true,
              invoiceitem,
              type: 'InvoiceItemMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'InvoiceItemMutationResult'
          };
        }
      },
      async update_invoiceitem(
        obj,
        {
          stripe_account_id,
          invoiceitem_id,
          ...args
        }: { stripe_account_id: string; invoiceitem_id: string } & Stripe.InvoiceItemUpdateParams,
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

            const invoiceitem = await stripe
              .get(stripe_account)
              .invoiceItems.update(invoiceitem_id, args);

            // success
            return {
              success: true,
              invoiceitem,
              type: 'InvoiceItemMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'InvoiceItemMutationResult'
          };
        }
      },
      async delete_invoiceitem(obj, { stripe_account_id, invoiceitem_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const invoiceitem = await stripe.get(stripe_account).invoiceItems.del(invoiceitem_id);

            // success
            return {
              success: true,
              invoiceitem,
              type: 'InvoiceItemMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'InvoiceItemMutationResult'
          };
        }
      }
    }
  }
};
