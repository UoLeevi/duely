import gql from 'graphql-tag';
import { queryResource, queryResourceAccess, Resources } from '@duely/db';
import stripe from '@duely/stripe';
import { GqlTypeDefinition } from '../../types';
import { createResolverForReferencedResourceAll, withStripeAccountProperty } from '../../util';
import { DuelyGraphQLError } from '../../errors';
import Stripe from 'stripe';

// see: https://stripe.com/docs/api/accounts/object

export const StripeAccount: GqlTypeDefinition<
  Resources['stripe account'] & Omit<Stripe.Account, 'id' | 'object'>
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
      coupons(
        created: DateTime
        starting_after_id: String
        ending_before_id: String
        limit: Int
      ): [PaymentIntent!]!
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
      bank_accounts(
        starting_after_id: String
        ending_before_id: String
        limit: Int
      ): [BankAccount!]!
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
          return await stripe.get(source).accountLinks.create({
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

        try {
          const access = await queryResourceAccess(context, source.id);

          if (access !== 'owner') {
            throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
          }

          // retrive connected account balance
          // see: https://stripe.com/docs/api/balance/balance_retrieve
          const balance = await stripe.get(source).balance.retrieve();
          return withStripeAccountProperty(balance, source);
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
            throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
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
          const list = await stripe.get(source).balanceTransactions.list(args);
          return withStripeAccountProperty(list.data, source);
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
            throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
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
          const list = await stripe.get(source).paymentIntents.list(args);
          return withStripeAccountProperty(list.data, source);
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      async bank_accounts(source, { starting_after_id, ending_before_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const access = await queryResourceAccess(context, source.id);

          if (access !== 'owner') {
            throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
          }

          if (starting_after_id) {
            args.starting_after = starting_after_id;
          }

          if (ending_before_id) {
            args.ending_before = ending_before_id;
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
      async coupons(source, { starting_after_id, ending_before_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const access = await queryResourceAccess(context, source.id);

          if (access !== 'owner') {
            throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
          }

          if (starting_after_id) {
            args.starting_after = starting_after_id;
          }

          if (ending_before_id) {
            args.ending_before = ending_before_id;
          }

          // see: https://stripe.com/docs/api/coupons/list
          const list = await stripe.get(source).coupons.list(args);
          return withStripeAccountProperty(list.data, source);
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    },
    Query: {
      async stripe_account(source, args, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const stripe_account = await queryResource(context, 'stripe account', args.id);
          const { id, object, ...stripe_account_ext } = await stripe
            .get(stripe_account)
            .accounts.retrieve(stripe_account.stripe_id_ext);
          return { ...stripe_account, ...stripe_account_ext };
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
      created: DateTime!
      expires_at: DateTime!
    }
  `,
  resolvers: {
    StripeAccountLink: {
      created: (source) => new Date(source.created * 1000),
      expires_at: (source) => new Date(source.expires_at * 1000)
    }
  }
};
