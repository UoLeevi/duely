import gql from 'graphql-tag';
import { queryResource, queryResourceAccess, Resources } from '@duely/db';
import stripe from '@duely/stripe';
import { GqlTypeDefinition } from '../../types';
import { timestampToDate } from '@duely/util';
import {
  createResolverForReferencedResourceAll,
  createStripeListResolverForReferencedResource,
  createStripeRetrieveResolverForReferencedResource,
  withStripeAccountProperty
} from '../../util';
import { DuelyGraphQLError } from '../../errors';
import Stripe from 'stripe';

// see: https://stripe.com/docs/api/accounts/object

export const StripeAccount: GqlTypeDefinition<
  Resources['stripe account'] &
    Omit<Stripe.Account, 'id' | 'object'> & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type StripeAccount {
      id: ID!
      id_ext: ID!
      livemode: Boolean!
      account_update_url: StripeAccountLink!
      balance: StripeBalance!
      balance_transactions(
        payout_id: ID
        type: String
        available_on: Int
        created: Int
        currency: String
        starting_after: String
        ending_before: String
        limit: Int
      ): [BalanceTransaction!]!
      payment_intents(
        customer: ID
        created: Int
        starting_after: String
        ending_before: String
        limit: Int
      ): [PaymentIntent!]!
      charges(
        payment_intent: ID
        created: Int
        starting_after: String
        ending_before: String
        limit: Int
      ): [Charge!]!
      customers(
        filter: CustomerFilter
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Customer!]!
      coupons(created: Int, starting_after: String, ending_before: String, limit: Int): [Coupon!]!
      invoices(
        customer: ID
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
        customer: ID
        invoice: ID
        pending: Boolean
        created: Int
        starting_after: String
        ending_before: String
        limit: Int
      ): [InvoiceItem!]!
      subscriptions(
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
      business_profile: BusinessProfile!
      business_type: String
      capabilities: StripeCapabilities!
      requirements: StripeRequirements!
      settings: StripeSettings!
      charges_enabled: Boolean!
      country: String!
      created: DateTime!
      default_currency: String
      details_submitted: Boolean!
      email: String
      payouts_enabled: Boolean!
      bank_accounts(starting_after: String, ending_before: String, limit: Int): [BankAccount!]!
    }

    extend type Query {
      stripe_account(id: ID!): StripeAccount
    }

    type BusinessProfile {
      mcc: String
      name: String
      product_description: String
      support_address: String
      support_email: String
      support_phone: String
      support_url: String
      url: String
    }

    type StripeCapabilities {
      card_payments: String
      transfers: String
    }

    type StripeRequirements {
      current_deadline: String
      disabled_reason: String
      currently_due: [String]!
      eventually_due: [String]!
      past_due: [String]!
      pending_verification: [String]!
    }

    type StripeSettings {
      branding: StripeBranding
    }

    type StripeBranding {
      icon: String
      logo: String
      primary_color: String
      secondary_color: String
    }

    type StripeBalance {
      available: [StripeCurrencyBalance!]!
      pending: [StripeCurrencyBalance!]!
      connect_reserved: [StripeCurrencyBalance!]
      instant_available: [StripeCurrencyBalance!]
    }

    type StripeCurrencyBalance {
      amount: Int!
      currency: String!
      source_types: StripeBalanceSource!
    }

    type StripeBalanceSource {
      bank_account: Int
      card: Int
    }
  `,
  resolvers: {
    StripeAccount: {
      id_ext: (source) => source.stripe_id_ext,
      created: (source) => new Date(source.created! * 1000),
      ...createResolverForReferencedResourceAll({
        name: 'customers',
        resource_name: 'customer',
        column_name: 'stripe_account_id'
      }),
      async account_update_url(source, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        const stripe_env = source.livemode ? 'live' : 'test';

        try {
          const access = await queryResourceAccess(context, source.id);

          if (access !== 'owner') {
            throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
          }

          const return_url = `https://${source.business_profile?.url ?? 'duely.app'}`;

          // create stripe account verification url
          // see: https://stripe.com/docs/api/account_links/create
          return await stripe[stripe_env].accountLinks.create({
            account: source.stripe_id_ext,
            refresh_url: return_url,
            return_url,
            type:
              (source.requirements?.eventually_due ?? []).length === 0
                ? 'account_update'
                : 'account_onboarding',
            collect: 'eventually_due'
          });
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      async balance(source, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        const access = await queryResourceAccess(context, source.id);

        if (access !== 'owner') {
          throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
        }

        // see: https://stripe.com/docs/api/balance
        const balance = await stripe.get(source).balance.retrieve();
        return withStripeAccountProperty(balance, source);
      },
      ...createStripeListResolverForReferencedResource({
        name: 'balance_transactions',
        object: 'balance_transaction',
        role: 'owner'
      }),
      ...createStripeListResolverForReferencedResource({
        name: 'payment_intents',
        object: 'payment_intent',
        role: 'owner'
      }),
      ...createStripeListResolverForReferencedResource({
        name: 'charges',
        object: 'charge',
        role: 'owner'
      }),
      async bank_accounts(source, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const access = await queryResourceAccess(context, source.id);

          if (access !== 'owner') {
            throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
          }

          // see: https://stripe.com/docs/api/external_account_bank_accounts/list
          const list = await stripe
            .get(source)
            .accounts.listExternalAccounts(source.stripe_id_ext, args);
          return withStripeAccountProperty(
            list.data?.filter((external_account) => external_account.object === 'bank_account'),
            source
          );
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      ...createStripeListResolverForReferencedResource({
        name: 'coupons',
        object: 'coupon',
        expand: ['applies_to'],
        role: 'owner'
      }),
      ...createStripeListResolverForReferencedResource({
        name: 'invoices',
        object: 'invoice',
        role: 'owner'
      }),
      ...createStripeListResolverForReferencedResource({
        name: 'invoiceitems',
        object: 'invoiceitem',
        role: 'owner'
      }),
      ...createStripeListResolverForReferencedResource({
        name: 'subscriptions',
        object: 'subscription',
        role: 'owner'
      })
    },
    Query: {
      async stripe_account(source, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const stripe_account = await queryResource(context, 'stripe account', args.id);
          const { id, object, ...stripe_account_ext } = await stripe
            .get(stripe_account)
            .accounts.retrieve();
          return withStripeAccountProperty(
            { ...stripe_account, ...stripe_account_ext },
            stripe_account
          );
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    }
  }
};

export const StripeAccountLink: GqlTypeDefinition<Stripe.AccountLink> = {
  typeDef: gql`
    type StripeAccountLink {
      type: String!
      url: String!
      created: Int!
      expires_at: Int!
    }
  `,
  resolvers: {
    StripeAccountLink: {
      created: (source) => timestampToDate(source.created),
      expires_at: (source) => timestampToDate(source.expires_at)
    }
  }
};
