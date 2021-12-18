// see: https://stripe.com/docs/api/checkout/sessions/object

import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import gql from 'graphql-tag';
import stripe from '@duely/stripe';
import { DuelyGraphQLError } from '../../errors';
import { GqlTypeDefinition } from '../../types';
import { timestampToDate } from '@duely/util';
import { createStripeRetrieveResolverForReferencedResource, withStripeAccountProperty } from '../../util';
import Stripe from 'stripe';
import { Resources } from '@duely/db';

export const StripeCheckoutSession: GqlTypeDefinition<
  Stripe.Checkout.Session & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type StripeCheckoutSession {
      id: ID!
      id_ext: ID!
      url: String
      allow_promotion_codes: Boolean
      amount_subtotal: Int
      amount_total: Int
      billing_address_collection: String
      cancel_url: String
      client_reference_id: String
      currency: String
      customer: StripeCustomer
      customer_email: String
      line_items(starting_after_id: String, ending_before_id: String, limit: Int): [LineItem!]!
      livemode: Boolean
      locale: String
      mode: String
      payment_method_types: [String]
      payment_status: String
      payment_intent: PaymentIntent
      submit_type: String
      success_url: String
    }

    type LineItem {
      id: ID!
      amount_subtotal: Int!
      amount_total: Int!
      currency: String!
      description: String!
      price: StripePrice
      quantity: Int
    }

    type StripePrice {
      id: String!
      id_ext: String!
      active: Boolean!
      billing_scheme: String!
      created: DateTime
      currency: String!
      livemode: Boolean!
      lookup_key: String
      nickname: String
      product: String
      recurring: StripePriceRecurring
      tax_behavior: String
      tiers: [StripePriceTier!]
      tiers_mode: String
      transform_quantity: StripePriceTransformQuantity
      type: String!
      unit_amount: Int
      unit_amount_decimal: String
    }

    type StripePriceRecurring {
      aggregate_usage: String
      interval: String!
      interval_count: Int!
      trial_period_days: Int
      usage_type: String
    }

    type StripePriceTier {
      flat_amount: Int
      flat_amount_decimal: String
      unit_amount: Int
      unit_amount_decimal: String
      up_to: Int
    }

    type StripePriceTransformQuantity {
      divide_by: Int
      round: String
    }
  `,
  resolvers: {
    StripeCheckoutSession: {
      id_ext: (source) => source.id,
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'customer',
        object: 'customer'
      }),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'payment_intent',
        object: 'payment_intent'
      }),
      async line_items(source, { starting_after_id, ending_before_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          if (starting_after_id) {
            args.starting_after = starting_after_id;
          }

          if (ending_before_id) {
            args.ending_before = ending_before_id;
          }

          // see: https://stripe.com/docs/api/checkout/sessions/line_items
          const list = await stripe
            .get(source.stripe_account)
            .checkout.sessions.listLineItems(source.id, args);

          return withStripeAccountProperty(list.data, source.stripe_account);
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    },
    StripePrice: {
      id_ext: (source) => source.id,
      created: (source: Stripe.Price) => timestampToDate(source.created),
    }
  }
};
