// see: https://stripe.com/docs/api/checkout/sessions/object

import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import gql from 'graphql-tag';
import stripe from '@duely/stripe';
import { DuelyGraphQLError } from '../../errors';
import { GqlTypeDefinition } from '../../types';
import { withStripeAccountProperty } from '../../util';
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
      price: String
      quantity: Int
    }
  `,
  resolvers: {
    StripeCheckoutSession: {
      id_ext: (source) => source.id,
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
      },
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
    }
  }
};
