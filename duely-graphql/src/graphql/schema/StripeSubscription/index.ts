// see: https://stripe.com/docs/api/subscriptions/object

import { Resources } from '@duely/db';
import { timestampToDate } from '@duely/util';
import gql from 'graphql-tag';
import Stripe from 'stripe';
import { GqlTypeDefinition } from '../../types';
import { createStripeListQueryResolver, createStripeRetrieveQueryResolver, createStripeRetrieveResolverForReferencedResource } from '../../util';

export const StripeSubscription: GqlTypeDefinition<
  Stripe.Subscription & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type StripeSubscription {
      id: ID!
      application_fee_percent: Int
      automatic_tax: SubscriptionAutomaticTax!
      billing_cycle_anchor: DateTime!
      billing_thresholds: SubscriptionBillingThresholds
      cancel_at: DateTime
      cancel_at_period_end: Boolean!
      canceled_at: DateTime
      collection_method: String!
      created: DateTime!
      current_period_end: DateTime!
      current_period_start: DateTime!
      customer: StripeCustomer
      days_until_due: Int
      # default_payment_method: string | Stripe.PaymentMethod | null;
      # default_source: string | Stripe.CustomerSource | null;
      # default_tax_rates: Array<Stripe.TaxRate> | null;
      discount: Discount
      ended_at: DateTime
      # items: ApiList<Stripe.SubscriptionItem>;
      latest_invoice: Invoice
      livemode: Boolean!
      # metadata: Stripe.Metadata;
      next_pending_invoice_item_invoice: DateTime
      pause_collection: SubscriptionPauseCollection
      payment_settings: SubscriptionPaymentSettings
      pending_invoice_item_interval: String
      # pending_setup_intent: string | Stripe.SetupIntent | null;
      pending_update: SubscriptionPendingUpdate
      # schedule: string | Stripe.SubscriptionSchedule | null;
      start_date: DateTime!
      status: String!
      # transfer_data: Subscription.TransferData | null;
      trial_end: DateTime
      trial_start: DateTime
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

    type SubscriptionPendingUpdate {
      billing_cycle_anchor: Int
      expires_at: Int!
      # subscription_items: [Stripe.SubscriptionItem]
      trial_end: Int
      trial_from_plan: Boolean
    }

    extend type Query {
      subscription(stripe_account_id: ID!, subscription_id: ID!): StripeSubscription
      subscriptions(
        stripe_account_id: ID!
        customer: ID
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

    input TimeStampFilter {
      gt: Int
      gte: Int
      lt: Int
      lte: Int
    }
  `,
  resolvers: {
    StripeSubscription: {
      cancel_at: (source) => timestampToDate(source.cancel_at),
      canceled_at: (source) => timestampToDate(source.canceled_at),
      created: (source) => timestampToDate(source.created),
      current_period_end: (source) => timestampToDate(source.current_period_end),
      current_period_start: (source) => timestampToDate(source.current_period_start),
      ended_at: (source) => timestampToDate(source.ended_at),
      next_pending_invoice_item_invoice: (source) => timestampToDate(source.next_pending_invoice_item_invoice),
      start_date: (source) => timestampToDate(source.start_date),
      trial_end: (source) => timestampToDate(source.trial_end),
      trial_start: (source) => timestampToDate(source.trial_start),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'customer',
        endpoint: 'customers'
      }),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'latest_invoice',
        endpoint: 'invoices'
      }),
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
    },
    Query: {
      ...createStripeRetrieveQueryResolver({
        name: 'subscription',
        endpoint: 'subscriptions'
      }),
      ...createStripeListQueryResolver({
        name: 'subscriptions',
        endpoint: 'subscriptions'
      })
    }
  }
};
