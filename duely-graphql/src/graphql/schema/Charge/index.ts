// see: https://stripe.com/docs/api/charges/object

import stripe from '@duely/stripe';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import { timestampToDate, withStripeAccountProperty } from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import Stripe from 'stripe';
import { Resources } from '@duely/db';

export const Charge: GqlTypeDefinition<
  Stripe.Charge & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type Charge {
      id: ID!
      id_ext: ID!
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
  `,
  resolvers: {
    Charge: {
      id_ext: (source) => source.id,
      created: (source) => timestampToDate(source.created),
      async balance_transaction(source, args, context, info) {
        if (source.balance_transaction == null) return null;
        if (typeof source.balance_transaction === 'object') return source.balance_transaction;

        const parsedResolveInfoFragment = parseResolveInfo(info);
        console.log(parsedResolveInfoFragment);

        const balance_transaction = await stripe
          .get(source.stripe_account)
          .balanceTransactions.retrieve(source.balance_transaction);
        return withStripeAccountProperty(balance_transaction, source.stripe_account);
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
      }
    }
  }
};
