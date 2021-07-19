import gql from 'graphql-tag';
import { queryResource, queryResourceAccess } from '@duely/db';
import stripe from '../../../stripe';
import { GqlTypeDefinition } from '../../types';
import { createResolverForReferencedResourceAll } from '../../util';
import { DuelyGraphQLError } from '../../errors';

// see: https://stripe.com/docs/api/accounts/object

export const StripeAccount: GqlTypeDefinition = {
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
        available_on: DateTime
        created: DateTime
        currency: String
        starting_after_id: String
        ending_before_id: String
        limit: Int
      ): [BalanceTransaction!]!
      payment_intents(
        customer_id: ID
        created: DateTime
        starting_after_id: String
        ending_before_id: String
        limit: Int
      ): [PaymentIntent!]!
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

    type StripeAccountLink {
      type: String!
      url: String!
      created: DateTime!
      expires_at: DateTime!
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
      created: (source) => new Date(source.created * 1000),
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
            throw new Error('Only owner can access this information');
          }

          const return_url = `https://${source.business_profile.url}`;

          // create stripe account verification url
          // see: https://stripe.com/docs/api/account_links/create
          return await stripe[stripe_env].accountLinks.create({
            account: source.stripe_id_ext,
            refresh_url: return_url,
            return_url,
            type: source.details_submitted ? 'account_onboarding' : 'account_update',
            collect: 'eventually_due'
          });
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      async balance(source, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        const stripe_env = source.livemode ? 'live' : 'test';

        try {
          const access = await queryResourceAccess(context, source.id);

          if (access !== 'owner') {
            throw new Error('Only owner can access this information');
          }

          // retrive connected account balance
          // see: https://stripe.com/docs/api/balance/balance_retrieve
          return await stripe[stripe_env].balance.retrieve({ stripeAccount: source.stripe_id_ext });
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      async balance_transactions(
        source,
        { payout_id, starting_after_id, ending_before_id, ...args },
        context,
        info
      ) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        const stripe_env = source.livemode ? 'live' : 'test';

        try {
          const access = await queryResourceAccess(context, source.id);

          if (access !== 'owner') {
            throw new Error('Only owner can access this information');
          }

          if (payout_id) {
            args.payout = payout_id;
          }

          if (starting_after_id) {
            args.starting_after = starting_after_id;
          }

          if (ending_before_id) {
            args.ending_before = ending_before_id;
          }

          // see: https://stripe.com/docs/api/balance_transactions/list
          const list = await stripe[stripe_env].balanceTransactions.list(args, {
            stripeAccount: source.stripe_id_ext
          });
          return list.data?.map((txn) => ({
            livemode: source.livemode,
            stripeAccount: source.stripe_id_ext,
            ...txn
          }));
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      async payment_intents(
        source,
        { customer_id, starting_after_id, ending_before_id, ...args },
        context,
        info
      ) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        const stripe_env = source.livemode ? 'live' : 'test';

        try {
          const access = await queryResourceAccess(context, source.id);

          if (access !== 'owner') {
            throw new Error('Only owner can access this information');
          }

          if (customer_id) {
            args.customer = customer_id;
          }

          if (starting_after_id) {
            args.starting_after = starting_after_id;
          }

          if (ending_before_id) {
            args.ending_before = ending_before_id;
          }

          // see: https://stripe.com/docs/api/payment_intents/list
          const list = await stripe[stripe_env].paymentIntents.list(args, {
            stripeAccount: source.stripe_id_ext
          });
          return list.data?.map((pi) => ({
            stripeAccount: source.stripe_id_ext,
            ...pi
          }));
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    },
    StripeAccountLink: {
      created: (source) => new Date(source.created * 1000),
      expires_at: (source) => new Date(source.expires_at * 1000)
    },
    Query: {
      async stripe_account(source, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const stripe_account = await queryResource(context, 'stripe account', args.id);
          const stripe_env = stripe_account.livemode ? 'live' : 'test';

          const { id, object, ...stripe_account_ext } = await stripe[stripe_env].accounts.retrieve(
            stripe_account.stripe_id_ext
          );
          return { ...stripe_account, ...stripe_account_ext };
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    }
  }
};
