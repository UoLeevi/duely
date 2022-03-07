// see: https://stripe.com/docs/api/payment_intents/object

import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { timestampToDate } from '@duely/util';
import { createStripeListQueryResolver, createStripeRetrieveQueryResolver, createStripeRetrieveResolverForReferencedResource, withStripeAccountProperty } from '../../util';
import Stripe from 'stripe';
import { Resources } from '@duely/db';

export const PaymentIntent: GqlTypeDefinition<
  Stripe.PaymentIntent & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type PaymentIntent {
      id: ID!
      amount: Int!
      amount_capturable: Int
      amount_received: Int
      application_fee_amount: Int
      canceled_at: DateTime
      cancellation_reason: String
      capture_method: String
      charges: [Charge]
      confirmation_method: String
      created: DateTime
      currency: String
      customer: StripeCustomer
      description: String
      invoice: String
      on_behalf_of: String
      payment_method: String
      payment_method_types: [String]
      receipt_email: String
      setup_future_usage: String
      shipping: Shipping
      statement_descriptor: String
      statement_descriptor_suffix: String
      status: String
      transfer_group: String
    }

    type Shipping {
      address: Address
      carrier: String
      name: String
      phone: String
      tracking_number: String
    }

    extend type Query {
      payment_intent(stripe_account_id: ID!, payment_intent_id: ID!): PaymentIntent
      payment_intents(
        stripe_account_id: ID!
        customer: ID
        created: Int
        starting_after: String
        ending_before: String
        limit: Int
      ): [PaymentIntent!]!
    }
  `,
  resolvers: {
    PaymentIntent: {
      created: (source) => timestampToDate(source.created),
      canceled_at: (source) => timestampToDate(source.created),
      charges: (source) => withStripeAccountProperty(source.charges?.data, source.stripe_account),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'customer',
        object: 'customer',
        role: 'owner'
      })
    },
    
    Query: {
      ...createStripeRetrieveQueryResolver({
        name: 'payment_intent',
        object: 'payment_intent',
        role: 'owner'
      }),
      ...createStripeListQueryResolver({
        name: 'payment_intents',
        object: 'payment_intent',
        role: 'owner'
      })
    }
  }
};
