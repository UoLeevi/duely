// see: https://stripe.com/docs/api/subscriptions/object

import { Resources, withSession } from '@duely/db';
import stripe, { deleteStripeObjects, StripeDeletableObjectType } from '@duely/stripe';
import { timestampToDate } from '@duely/util';
import gql from 'graphql-tag';
import Stripe from 'stripe';
import { DuelyGraphQLError } from '../../errors';
import { GqlTypeDefinition } from '../../types';
import {
  createStripeListQueryResolver,
  createStripeListResolverForReferencedResource,
  createStripeRetrieveQueryResolver,
  createStripeRetrieveResolverForReferencedResource
} from '../../util';
import { getTransactionFeePercentForSubscriptions } from '../SubscriptionPlan';

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
      items(starting_after: String, ending_before: String, limit: Int): [SubscriptionItem!]!
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
      subscription_items: [SubscriptionItem!]!
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

    extend type Mutation {
      create_subscription(
        stripe_account_id: ID!
        customer: ID!
        items: [SubscriptionItemInput!]!
        cancel_at_period_end: Boolean
        default_payment_method: String
        payment_behaviour: String
        backdate_start_date: Int
        billing_cycle_anchor: Int
        cancel_at: Int
        collection_method: String
        coupon: ID
        days_until_due: Int
        default_source: String
        promotion_code: ID
        proration_behaviour: String
        trial_end: Int
        trial_from_plan: Boolean
        trial_period_days: Int
      ): SubscriptionMutationResult!
      # update_subscription(
      #   stripe_account_id: ID!
      #   subscription_id: ID!
      #   auto_advance: Boolean
      #   collection_method: String
      #   description: String
      #   footer: String
      #   subscription: ID
      #   days_until_due: Int
      #   default_payment_method: ID
      #   default_source: ID
      #   due_date: Int
      # ): SubscriptionMutationResult!
      cancel_subscription(
        stripe_account_id: ID!
        subscription_id: ID!
        cancel_at_period_end: Boolean
        cancel_at: Int
        invoice_now: Boolean
        prorate: Boolean
      ): SubscriptionMutationResult!
    }

    input SubscriptionItemInput {
      price: ID!
      quantity: Int
    }

    type SubscriptionMutationResult implements MutationResult {
      success: Boolean!
      message: String
      subscription: StripeSubscription
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
      next_pending_invoice_item_invoice: (source) =>
        timestampToDate(source.next_pending_invoice_item_invoice),
      start_date: (source) => timestampToDate(source.start_date),
      trial_end: (source) => timestampToDate(source.trial_end),
      trial_start: (source) => timestampToDate(source.trial_start),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'customer',
        object: 'customer',
        role: 'owner'
      }),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'latest_invoice',
        object: 'invoice',
        role: 'owner'
      }),
      ...createStripeListResolverForReferencedResource({
        name: 'items',
        param: 'subscription',
        object: 'subscription_item',
        role: 'owner'
      })
    },
    Query: {
      ...createStripeRetrieveQueryResolver({
        name: 'subscription',
        object: 'subscription',
        role: 'owner'
      }),
      ...createStripeListQueryResolver({
        name: 'subscriptions',
        object: 'subscription',
        role: 'owner'
      })
    },
    Mutation: {
      async create_subscription(
        obj,
        {
          stripe_account_id,
          ...args
        }: { stripe_account_id: string } & {
          currency?: string;
        } & Stripe.SubscriptionCreateParams,
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
              const agency = await queryResource('agency', stripe_account.agency_id);

              const application_fee_percent = await getTransactionFeePercentForSubscriptions(
                agency.subscription_plan_id
              );

              const subscription = await stripe
                .get(stripe_account)
                .subscriptions.create({ ...args, application_fee_percent });

              // success
              return {
                success: true,
                subscription,
                type: 'SubscriptionMutationResult'
              };
            } catch (error: any) {
              deleteStripeObjects(stripe.get(stripe_account), rollbackObjects);

              return {
                // error
                success: false,
                message: error.message,
                type: 'SubscriptionMutationResult'
              };
            }
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'SubscriptionMutationResult'
          };
        }
      },
      async cancel_subscription(
        obj,
        {
          stripe_account_id,
          subscription_id,
          cancel_at_period_end,
          cancel_at,
          invoice_now,
          prorate
        }: {
          stripe_account_id: string;
          subscription_id: string;
          cancel_at_period_end?: boolean;
          cancel_at?: number;
          invoice_now?: boolean;
          prorate?: boolean;
        },
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
              throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can cancel subscription');
            }

            let subscription: Stripe.Subscription;

            if (cancel_at) {
              subscription = await stripe
                .get(stripe_account)
                .subscriptions.update(subscription_id, {
                  cancel_at
                });
            } else if (cancel_at_period_end) {
              subscription = await stripe
                .get(stripe_account)
                .subscriptions.update(subscription_id, {
                  cancel_at_period_end
                });
            } else {
              subscription = await stripe.get(stripe_account).subscriptions.del(subscription_id, {
                invoice_now,
                prorate
              });
            }

            // success
            return {
              success: true,
              subscription,
              type: 'SubscriptionMutationResult'
            };
          });
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'SubscriptionMutationResult'
          };
        }
      }
    }
  }
};
