// see: https://stripe.com/docs/api/subscriptions/object

import { queryResourceAccess, Resources } from '@duely/db';
import stripe from '@duely/stripe';
import { timestampToDate } from '@duely/util';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import gql from 'graphql-tag';
import Stripe from 'stripe';
import { DuelyGraphQLError } from '../../errors';
import { GqlTypeDefinition } from '../../types';
import { createResolverForReferencedResource, withStripeAccountProperty } from '../../util';

export const StripeSubscription: GqlTypeDefinition<
  Stripe.Subscription & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type StripeSubscription {
      id: ID!
      application_fee_percent: Int
      automatic_tax: SubscriptionAutomaticTax!
      billing_cycle_anchor: Int!
      billing_thresholds: SubscriptionBillingThresholds
      cancel_at: Int
      cancel_at_period_end: Boolean!
      canceled_at: Int
      collection_method: String!
      created: Int!
      current_period_end: Int!
      current_period_start: Int!
      customer: StripeCustomer
      days_until_due: Int
      # default_payment_method: string | Stripe.PaymentMethod | null;
      # default_source: string | Stripe.CustomerSource | null;
      # default_tax_rates: Array<Stripe.TaxRate> | null;
      discount: Discount
      ended_at: Int
      # items: ApiList<Stripe.SubscriptionItem>;
      latest_invoice: Invoice
      livemode: Boolean!
      # metadata: Stripe.Metadata;
      next_pending_invoice_item_invoice: Int
      pause_collection: SubscriptionPauseCollection
      payment_settings: SubscriptionPaymentSettings
      pending_invoice_item_interval: String
      # pending_setup_intent: string | Stripe.SetupIntent | null;
      pending_update: SubscriptionPendingUpdate
      # schedule: string | Stripe.SubscriptionSchedule | null;
      start_date: Int!
      status: String!
      # transfer_data: Subscription.TransferData | null;
      trial_end: Int
      trial_start: Int
    }

    type SubscriptionAutomaticTax {
      enabled: Boolean!
    }

    type SubscriptionBillingThresholds {
      amount_gte: Int
      reset_billing_cycle_anchor: Boolean
    }

    type SubscriptionPauseCollection {
      behavior: String!
      resumes_at: Int
    }

    type SubscriptionPaymentSettings {
      payment_method_options: SubscriptionPaymentMethodOptions
      payment_method_types: [String!]
    }

    type SubscriptionPaymentMethodOptions {
      acss_debit: SubscriptionAcssDebit
      bancontact: SubscriptionBancontact
      card: SubscriptionCard
    }

    type SubscriptionAcssDebit {
      mandate_options: SubscriptionAcssDebitMandateOptions
      verification_method: String
    }

    type SubscriptionAcssDebitMandateOptions {
      transaction_type: String
    }

    type SubscriptionBancontact {
      preferred_language: String!
    }

    type SubscriptionCard {
      request_three_d_secure: String
    }

    type PendingUpdate {
      billing_cycle_anchor: Int
      expires_at: Int!
      # subscription_items: [Stripe.SubscriptionItem]
      trial_end: Int
      trial_from_plan: Boolean
    }
  `,
  resolvers: {
    StripeSubscription: {
      id_ext: (source) => source.id,
      created: (source) => timestampToDate(source.created),
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
      async latest_invoice(source, args, context, info) {
        if (source.latest_invoice == null) return null;
        if (typeof source.latest_invoice === 'object') return source.latest_invoice;

        const resolveTree = parseResolveInfo(info) as ResolveTree;
        const fields = Object.keys(Object.values(resolveTree.fieldsByTypeName)[0]);
        if (fields.length === 1 && fields[0] === 'id') return { id: source.latest_invoice };

        const invoice = await stripe
          .get(source.stripe_account)
          .invoices.retrieve(source.latest_invoice);

        return withStripeAccountProperty(invoice, source.stripe_account);
      },
      // async invoiceitems(source, { starting_after_id, ending_before_id, ...args }, context, info) {
      //   if (!context.jwt)
      //     throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

      //   try {
      //     const access = await queryResourceAccess(context, source.stripe_account.id);

      //     if (access !== 'owner') {
      //       throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
      //     }

      //     if (starting_after_id) {
      //       args.starting_after = starting_after_id;
      //     }

      //     if (ending_before_id) {
      //       args.ending_before = ending_before_id;
      //     }

      //     // see: https://stripe.com/docs/api/invoiceitems/list
      //     const list = await stripe.get(source.stripe_account).invoiceItems.list({
      //       customer: source.id,
      //       ...args
      //     });

      //     return withStripeAccountProperty(list.data, source.stripe_account);
      //   } catch (error: any) {
      //     throw new Error(error.message);
      //   }
      // }
    }
  }
};
