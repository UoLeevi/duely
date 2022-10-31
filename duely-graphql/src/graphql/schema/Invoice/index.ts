// see: https://stripe.com/docs/api/invoices/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources, withSession } from '@duely/db';
import { DuelyGraphQLError } from '../../errors';
import stripe, { deleteStripeObjects, StripeDeletableObjectType } from '@duely/stripe';
import {
  createStripeRetrieveQueryResolver,
  createStripeRetrieveResolverForReferencedResource,
  withStripeAccountProperty
} from '../../util';
import { timestampToDate } from '@duely/util';
import { calculateTransactionFee } from '../SubscriptionPlan';

export const Invoice: GqlTypeDefinition<
  Stripe.Invoice & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type Invoice {
      id: ID!
      account_country: String
      account_name: String
      account_tax_ids: [String!]
      amount_due: Int!
      amount_paid: Int!
      amount_remaining: Int!
      application_fee_amount: Int
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
      ending_balance: Int
      footer: String
      hosted_invoice_url: String
      invoice_pdf: String
      # last_finalization_error: Invoice.LastFinalizationError | null;
      lines(starting_after: String, ending_before: String, limit: Int): [InvoiceLineItem!]!
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
      starting_balance: Int
      statement_descriptor: String
      status: String
      status_transitions: InvoiceStatusTransitions
      # subscription: string | Stripe.Subscription | null;
      subscription_proration_date: DateTime
      subtotal: Int!
      tax: Int
      # threshold_reason?: Invoice.ThresholdReason;
      total: Int!
      # total_discount_amounts: Array<Invoice.TotalDiscountAmount> | null;
      # total_tax_amounts: Array<Invoice.TotalTaxAmount>;
      # transfer_data: Invoice.TransferData | null;
      webhooks_delivered_at: DateTime
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

    input InvoiceItemInput {
      amount: Int
      description: String
      period: PeriodInput
      price: ID
      discountable: Boolean
      quantity: Int
      unit_amount: Int
      unit_amount_decimal: String
    }

    extend type Query {
      invoice(stripe_account_id: ID!, invoice_id: ID!): Invoice
    }

    extend type Mutation {
      create_invoice(
        stripe_account_id: ID!
        customer: ID!
        auto_advance: Boolean
        collection_method: String
        description: String
        footer: String
        subscription: ID
        days_until_due: Int
        default_payment_method: ID
        default_source: ID
        due_date: Int
        currency: String
        items: [InvoiceItemInput!]
      ): InvoiceMutationResult!
      update_invoice(
        stripe_account_id: ID!
        invoice_id: ID!
        auto_advance: Boolean
        collection_method: String
        description: String
        footer: String
        subscription: ID
        days_until_due: Int
        default_payment_method: ID
        default_source: ID
        due_date: Int
      ): InvoiceMutationResult!
      finalize_invoice(stripe_account_id: ID!, invoice_id: ID!): InvoiceMutationResult!
      void_invoice(stripe_account_id: ID!, invoice_id: ID!): InvoiceMutationResult!
      mark_invoice_uncollectible(stripe_account_id: ID!, invoice_id: ID!): InvoiceMutationResult!
      delete_invoice(stripe_account_id: ID!, invoice_id: ID!): InvoiceMutationResult!
    }

    type InvoiceMutationResult implements MutationResult {
      success: Boolean!
      message: String
      invoice: Invoice
    }
  `,
  resolvers: {
    Invoice: {
      created: (source) => timestampToDate(source.created),
      due_date: (source) => timestampToDate(source.due_date),
      next_payment_attempt: (source) => timestampToDate(source.next_payment_attempt),
      period_start: (source) => timestampToDate(source.period_start),
      period_end: (source) => timestampToDate(source.period_end),
      subscription_proration_date: (source) => timestampToDate(source.subscription_proration_date),
      webhooks_delivered_at: (source) => timestampToDate(source.webhooks_delivered_at),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'charge',
        object: 'charge',
        role: 'owner'
      }),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'customer',
        object: 'customer',
        role: 'owner'
      }),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'payment_intent',
        object: 'payment_intent',
        role: 'owner'
      }),
      async lines(source, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
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
      ...createStripeRetrieveQueryResolver({
        name: 'invoice',
        object: 'invoice',
        role: 'owner'
      })
    },
    Mutation: {
      async create_invoice(
        obj,
        {
          stripe_account_id,
          currency,
          items,
          ...args
        }: { stripe_account_id: string } & {
          currency?: string;
          items: Omit<Stripe.InvoiceItemCreateParams, 'customer'>[];
        } & Stripe.InvoiceCreateParams,
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

            const rollbackObjects: {
              id: string;
              object: StripeDeletableObjectType;
            }[] = [];

            try {
              let application_fee_amount = 0;
              const agency = await queryResource('agency', stripe_account.agency_id);

              if (items && items.length > 0) {
                if (!currency) {
                  currency = agency.default_pricing_currency;
                }

                if (!currency) {
                  const account = await stripe.get(stripe_account).accounts.retrieve();
                  currency = account.default_currency;
                }

                for (const item of items) {
                  const invoiceitem = await stripe.get(stripe_account).invoiceItems.create({
                    customer: args.customer!,
                    currency,
                    ...item
                  });

                  application_fee_amount += await calculateTransactionFee(
                    agency.subscription_plan_id,
                    invoiceitem.amount,
                    currency
                  );

                  rollbackObjects.push(invoiceitem);
                }
              }

              const invoice = await stripe
                .get(stripe_account)
                .invoices.create({ ...args, application_fee_amount });

              // success
              return {
                success: true,
                invoice,
                type: 'InvoiceMutationResult'
              };
            } catch (error: any) {
              deleteStripeObjects(stripe.get(stripe_account), rollbackObjects);

              return {
                // error
                success: false,
                message: error.message,
                type: 'InvoiceMutationResult'
              };
            }
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
      async finalize_invoice(obj, { stripe_account_id, invoice_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const invoice = await stripe.get(stripe_account).invoices.finalizeInvoice(invoice_id);

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
      async void_invoice(obj, { stripe_account_id, invoice_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const invoice = await stripe.get(stripe_account).invoices.voidInvoice(invoice_id);

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
      async mark_invoice_uncollectible(obj, { stripe_account_id, invoice_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const invoice = await stripe.get(stripe_account).invoices.markUncollectible(invoice_id);

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
