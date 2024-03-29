// see: https://stripe.com/docs/api/charges/object

import { timestampToDate } from '@duely/util';
import {
  createStripeListQueryResolver,
  createStripeRetrieveQueryResolver,
  createStripeRetrieveResolverForReferencedResource
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources } from '@duely/db';
import axios from 'axios';
import stripe from '@duely/stripe';

export const Charge: GqlTypeDefinition<
  Stripe.Charge & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type Charge {
      id: ID!
      amount: Int!
      amount_capturable: Int
      amount_received: Int
      application_fee_amount: Int
      authorization_code: String
      balance_transaction: BalanceTransaction
      billing_details: BillingDetails
      calculated_statement_descriptor: String
      captured: Boolean
      created: DateTime
      currency: String
      customer: StripeCustomer
      description: String
      disputed: Boolean
      failure_code: String
      failure_message: String
      fraud_details: FraudDetails
      invoice: String
      order: String
      outcome: Outcome
      paid: Boolean
      payment_intent: PaymentIntent
      payment_method: String
      receipt_email: String
      receipt_number: String
      receipt_url: String
      refunded: Boolean
      source_transfer: String
      statement_descriptor: String
      statement_descriptor_suffix: String
      status: String
      transfer: String
      transfer_group: String
    }

    type BillingDetails {
      address: Address
      email: String
      name: String
      phone: String
    }

    type FraudDetails {
      stripe_report: String
      user_report: String
    }

    type Outcome {
      network_status: String
      reason: String
      risk_level: String
      risk_score: Int
      rule: OutcomeRule
      seller_message: String
      type: String
    }

    type OutcomeRule {
      action: String
      id: String
      predicate: String
    }

    extend type Query {
      charge(stripe_account_id: ID!, charge_id: ID!): Charge
      charges(
        stripe_account_id: ID!
        payment_intent: ID
        created: Int
        starting_after: String
        ending_before: String
        limit: Int
      ): [Charge!]!
    }
  `,
  resolvers: {
    Charge: {
      async receipt_number(charge, args, context, info) {
        if (!charge.receipt_number && charge.receipt_url) {
          // Stripe generates the receipt only after `receipt_url` is requested
          await axios.get(charge.receipt_url);

          // Requery charge to get the `receipt_number`
          const res = await stripe.get(charge.stripe_account).charges.retrieve(charge.id);
          charge.receipt_number = res.receipt_number;
        }

        return charge.receipt_number;
      },
      created: (source) => timestampToDate(source.created),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'balance_transaction',
        object: 'balance_transaction',
        role: 'owner'
      }),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'payment_intent',
        object: 'payment_intent',
        role: 'owner'
      }),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'customer',
        object: 'customer',
        role: 'owner'
      })
    },
    Query: {
      ...createStripeRetrieveQueryResolver({
        name: 'charge',
        object: 'charge',
        role: 'owner'
      }),
      ...createStripeListQueryResolver({
        name: 'charges',
        object: 'charge',
        role: 'owner'
      })
    }
  }
};
