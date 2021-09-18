// see: https://stripe.com/docs/api/invoices/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources, withSession } from '@duely/db';
import { DuelyGraphQLError } from '../../errors';
import stripe from '@duely/stripe';
import { withStripeAccountProperty, timestampToDate } from '../../util';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';

export const Invoice: GqlTypeDefinition<
  Stripe.Invoice & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type Invoice {
      id: ID!
      id_ext: ID!
      account_country: String
      account_name: String
      account_tax_ids: [String!]!
      amount_due: Int!
      amount_paid: Int!
      amount_remaining: Int!
      application_fee_amount: Int!
      attempt_count: Int!
      attempted: Boolean!
      auto_advance: Boolean
      automatic_tax: InvoiceAutomaticTax!
      billing_reason: String
      charge: Charge
      collection_method: String
      created: DateTime!
      currency: String!
      custom_fields: [InvoiceCustomField!]
      customer: StripeCustomer
      customer_address: Address
      customer_email: String
      customer_name: String
      customer_phone: String
      customer_shipping: InvoiceCustomerShipping
      customer_tax_exempt: String
      customer_tax_ids: [CustomerTaxId!]
      default_payment_method: String
      # default_source: string | Stripe.CustomerSource | null;
      # default_tax_rates: Array<Stripe.TaxRate>;
      description: String
      discount: Discount
      discounts: [Discount!]
      due_date: DateTime
      ending_balance: Int!
      footer: String
      hosted_invoice_url: String
      invoice_pdf: String
      # last_finalization_error: Invoice.LastFinalizationError | null;
      lines(starting_after_id: String, ending_before_id: String, limit: Int): [InvoiceLineItem!]!
      livemode: Boolean!
      # metadata: Stripe.Metadata | null;
      next_payment_attempt: DateTime
      number: String
      # on_behalf_of: string | Stripe.Account | null;
      paid: Boolean!
      payment_intent: PaymentIntent
      # payment_settings: Invoice.PaymentSettings;
      period_end: DateTime!
      period_start: DateTime!
      post_payment_credit_notes_amount: Int!
      pre_payment_credit_notes_amount: Int!
      # quote: string | Stripe.Quote | null;
      receipt_number: String
      starting_balance: Int!
      statement_descriptor: String
      status: String
      status_transitions: InvoiceStatusTransitions
      # subscription: string | Stripe.Subscription | null;
      subscription_proration_date: DateTime
      subtotal: Int!
      tax: Int!
      # threshold_reason?: Invoice.ThresholdReason;
      total: Int!
      # total_discount_amounts: Array<Invoice.TotalDiscountAmount> | null;
      # total_tax_amounts: Array<Invoice.TotalTaxAmount>;
      # transfer_data: Invoice.TransferData | null;
      webhooks_delivered_at: DateTime!
    }

    type InvoiceAutomaticTax {
      enabled: Boolean!
      status: String
    }

    type InvoiceCustomField {
      name: String!
      value: String!
    }

    type InvoiceCustomerShipping {
      address: Address
      carrier: String
      name: String
      phone: String
      tracking_number: String
    }

    type CustomerTaxId {
      type: String
      value: String
    }

    extend type Query {
      invoice(stripe_account_id: ID!, invoice_id: ID!): Invoice
    }

    extend type Mutation {
      create_invoice(stripe_account_id: ID!, customer: ID!): InvoiceMutationResult!
      update_invoice(stripe_account_id: ID!, invoice_id: ID!): InvoiceMutationResult!
      delete_invoice(stripe_account_id: ID!, invoice_id: ID!): InvoiceMutationResult!
    }

    type InvoiceMutationResult implements MutationResult {
      success: Boolean!
      message: String
      coupon: Invoice
    }
  `,
  resolvers: {
    Invoice: {
      id_ext: (source) => source.id,
      created: (source) => timestampToDate(source.created),
      due_date: (source) => timestampToDate(source.due_date),
      next_payment_attempt: (source) => timestampToDate(source.next_payment_attempt),
      period_start: (source) => timestampToDate(source.period_start),
      period_end: (source) => timestampToDate(source.period_end),
      subscription_proration_date: (source) => timestampToDate(source.subscription_proration_date),
      webhooks_delivered_at: (source) => timestampToDate(source.webhooks_delivered_at),
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
      },
      async payment_intent(source, args, context, info) {
        if (source.payment_intent == null) return null;
        if (typeof source.payment_intent === 'object') return source.payment_intent;

        const resolveTree = parseResolveInfo(info) as ResolveTree;
        const fields = Object.keys(Object.values(resolveTree.fieldsByTypeName)[0]);
        if (fields.length === 1 && fields[0] === 'id') return { id: source.payment_intent };

        const payment_intent = await stripe
          .get(source.stripe_account)
          .paymentIntents.retrieve(source.payment_intent);
        return withStripeAccountProperty(payment_intent, source.stripe_account);
      },
      async lines(source, { starting_after_id, ending_before_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          if (starting_after_id) {
            args.starting_after = starting_after_id;
          }

          if (ending_before_id) {
            args.ending_before = ending_before_id;
          }

          // see: https://stripe.com/docs/api/invoices/invoice_lines
          const list = await stripe
            .get(source.stripe_account)
            .invoices.listLineItems(source.id, args);

          return withStripeAccountProperty(list.data, source.stripe_account);
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    },
    Query: {
      async invoice(source, { stripe_account_id, invoice_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const invoice = await stripe.get(stripe_account).invoices.retrieve(invoice_id);
            return withStripeAccountProperty(invoice, stripe_account);
          });
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    },
    Mutation: {
      async create_invoice(
        obj,
        { stripe_account_id, ...args }: { stripe_account_id: string } & Stripe.InvoiceCreateParams,
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

            const invoice = await stripe.get(stripe_account).invoices.create(args);

            // success
            return {
              success: true,
              invoice,
              type: 'InvoiceMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'InvoiceMutationResult'
          };
        }
      },
      async update_invoice(obj, { stripe_account_id, invoice_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const invoice = await stripe.get(stripe_account).invoices.update(invoice_id, args);

            // success
            return {
              success: true,
              invoice,
              type: 'InvoiceMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'InvoiceMutationResult'
          };
        }
      },
      async delete_invoice(obj, { stripe_account_id, invoice_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const invoice = await stripe.get(stripe_account).invoices.del(invoice_id);

            // success
            return {
              success: true,
              invoice,
              type: 'InvoiceMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'InvoiceMutationResult'
          };
        }
      }
    }
  }
};

export const InvoiceStatusTransitions: GqlTypeDefinition<Stripe.Invoice.StatusTransitions> = {
  typeDef: gql`
    type InvoiceStatusTransitions {
      finalized_at: DateTime
      marked_uncollectible_at: DateTime
      paid_at: DateTime
      voided_at: DateTime
    }
  `,
  resolvers: {
    InvoiceStatusTransitions: {
      finalized_at: (source) => timestampToDate(source.finalized_at),
      marked_uncollectible_at: (source) => timestampToDate(source.marked_uncollectible_at),
      paid_at: (source) => timestampToDate(source.paid_at),
      voided_at: (source) => timestampToDate(source.voided_at)
    }
  }
};
