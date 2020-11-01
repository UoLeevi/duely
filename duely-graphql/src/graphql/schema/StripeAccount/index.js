import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';
import stripe from '../../../stripe';

export const StripeAccount = {
  typeDef: `
    type StripeAccount {
      id: ID!
      id_ext: ID!
      account_update_url: StripeAccountLink!
      business_profile: BusinessProfile!
      business_type: String
      capabilities: StripeCapabilities!
      requirements: StripeRequirements!
      settings: StripeSettings!
      charges_enabled: Boolean!
      country: String!
      created: Date!
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
      created: Date!
      expires_at: Date!
    }
  `,
  resolvers: {
    StripeAccount: {
      id_ext: source => source.stripe_id_ext,
      created: source => new Date(source.created * 1000),
      async account_update_url(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          const access = await withConnection(context, async withSession => {
            return await withSession(async ({ queryResourceAccess }) => {
              return await queryResourceAccess(source.id);
            });
          });

          if (access !== 'owner') {
            throw new Error('Only owner can access this information');
          }

          const return_url = `https://${source.business_profile.url}`;
          
          // create stripe account verification url
          // see: https://stripe.com/docs/api/account_links/create
          return await stripe.accountLinks.create({
            account: source.stripe_id_ext,
            refresh_url: return_url,
            return_url,
            type: source.details_submitted ? 'account_onboarding' : 'account_update',
            collect: 'eventually_due'
          });

        } catch (error) {
          throw new Error(error.message);
        }
      }
    },
    StripeAccountLink: {
      created: source => new Date(source.created * 1000),
      expires_at: source => new Date(source.expires_at * 1000)
    },
    Query: {
      async stripe_account(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          const stripe_account = await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource }) => {
              return await queryResource(args.id);
            });
          });

          const { id, object, ...stripe_account_ext } = await stripe.accounts.retrieve(stripe_account.stripe_id_ext);
          return { ...stripe_account, ...stripe_account_ext };

        } catch (error) {
          throw new Error(error.message);
        }
      }
    }
  }
};
