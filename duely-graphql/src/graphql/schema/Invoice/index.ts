// see: https://stripe.com/docs/api/invoices/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources, withSession } from '@duely/db';
import { DuelyGraphQLError } from '../../errors';
import stripe from '@duely/stripe';
import { withStripeAccountProperty } from '../../util';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';

export const Invoice: GqlTypeDefinition<
  Stripe.Invoice & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type Invoice {
      id: String!
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
      automatic_tax: InvoiceAutomaticTax!;
      billing_reason: String;
      charge: Charge;
      collection_method: Invoice.CollectionMethod | null;
      created: DateTime!
      currency: String!
      custom_fields: Array<Invoice.CustomField> | null;
      customer: StripeCustomer
      customer_address: Address
      customer_email: String
      customer_name: String
      customer_phone: String
      customer_shipping: Invoice.CustomerShipping | null;
      customer_tax_exempt: Invoice.CustomerTaxExempt | null;
      customer_tax_ids: Array<Invoice.CustomerTaxId> | null;
      default_payment_method: string | Stripe.PaymentMethod | null;
      default_source: string | Stripe.CustomerSource | null;
      default_tax_rates: Array<Stripe.TaxRate>;
      description: String
      discount: Stripe.Discount | null;
      discounts: Array<
        string | Stripe.Discount | Stripe.DeletedDiscount
      > | null;
      due_date: Int!
      ending_balance: Int!
      footer: String
      hosted_invoice_url: String
      invoice_pdf: String
      last_finalization_error: Invoice.LastFinalizationError | null;
      lines: ApiList<Stripe.InvoiceLineItem>;
      livemode: Boolean!
      metadata: Stripe.Metadata | null;
      next_payment_attempt: Int!
      number: String
      on_behalf_of: string | Stripe.Account | null;
      paid: Boolean!
      payment_intent: PaymentIntent;
      payment_settings: Invoice.PaymentSettings;
      period_end: Int!
      period_start: Int!
      post_payment_credit_notes_amount: Int!
      pre_payment_credit_notes_amount: Int!
      quote: string | Stripe.Quote | null;
      receipt_number: String
      starting_balance: Int!
      statement_descriptor: String
      status: Invoice.Status | null;
      status_transitions: Invoice.StatusTransitions;
      subscription: string | Stripe.Subscription | null;
      subscription_proration_date?: Int!
      subtotal: Int!
      tax: Int!
      threshold_reason?: Invoice.ThresholdReason;
      total: Int!
      total_discount_amounts: Array<Invoice.TotalDiscountAmount> | null;
      total_tax_amounts: Array<Invoice.TotalTaxAmount>;
      transfer_data: Invoice.TransferData | null;
      webhooks_delivered_at: Int!
    }

    type InvoiceAutomaticTax {
      enabled: Boolean!
      status: String
    }

    input InvoiceAppliesToInput {
      products: [String!]
    }

    extend type Query {
      coupon(stripe_account_id: ID!, coupon_id: ID!): Invoice
    }

    extend type Mutation {
      create_coupon(
        stripe_account_id: ID!
        amount_off: Int
        currency: String
        percent_off: Int
        duration: String
        duration_in_months: Int
        name: String
        id: String
        applies_to: InvoiceAppliesToInput
        max_redemptions: Int
        redeem_by: Int
      ): InvoiceMutationResult!
      update_coupon(stripe_account_id: ID!, coupon_id: ID!, name: String): InvoiceMutationResult!
      delete_coupon(stripe_account_id: ID!, coupon_id: ID!): InvoiceMutationResult!
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
      created: (source) => new Date(source.created * 1000),
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
      }
    },
    Query: {
      async coupon(source, { stripe_account_id, coupon_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const coupon = await stripe.get(stripe_account).coupons.retrieve(coupon_id);
            return withStripeAccountProperty(coupon, stripe_account);
          });
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    },
    Mutation: {
      async create_coupon(
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

            const coupon = await stripe.get(stripe_account).coupons.create(args);

            // success
            return {
              success: true,
              coupon,
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
      async update_coupon(obj, { stripe_account_id, coupon_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const coupon = await stripe.get(stripe_account).coupons.update(coupon_id, args);

            // success
            return {
              success: true,
              coupon,
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
      async delete_coupon(obj, { stripe_account_id, coupon_id }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, queryResourceAccess }) => {
            const stripe_account = await queryResource('stripe account', stripe_account_id);
            const access = await queryResourceAccess(stripe_account.id);

            if (access !== 'owner') {
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
            }

            const coupon = await stripe.get(stripe_account).coupons.del(coupon_id);

            // success
            return {
              success: true,
              coupon,
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
