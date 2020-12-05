// see: https://stripe.com/docs/api/charges/object

import stripe from '../../../stripe';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { withStripeAccountProperty } from '../../util';

export const Charge = {
  typeDef: `
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
      created: Date
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
      id_ext: source => source.id,
      created: source => new Date(source.created * 1000),
      async balance_transaction(source, args, context, info) {
        if (source.balance_transaction == null) return null;
        if (typeof source.balance_transaction === 'object') return source.balance_transaction;

        const parsedResolveInfoFragment = parseResolveInfo(info);
        console.log(parsedResolveInfoFragment);

        const balance_transaction = await stripe.balanceTransactions.retrieve(source.balance_transaction, { stripeAccount: source.stripeAccount });
        return withStripeAccountProperty(balance_transaction, source);
      },
      async payment_intent(source, args, context, info) {
        if (source.payment_intent == null) return null;
        if (typeof source.payment_intent === 'object') return source.payment_intent;

        const fields = Object.keys(Object.values(parseResolveInfo(info).fieldsByTypeName)[0]);
        if (fields.length === 1 && fields[0] === 'id') return { id: source.payment_intent };

        const payment_intent = await stripe.paymentIntents.retrieve(source.payment_intent, { stripeAccount: source.stripeAccount });
        return withStripeAccountProperty(payment_intent, source);
      },
      async customer(source, args, context, info) {
        if (source.customer == null) return null;
        if (typeof source.customer === 'object') return source.customer;

        const fields = Object.keys(Object.values(parseResolveInfo(info).fieldsByTypeName)[0]);
        if (fields.length === 1 && fields[0] === 'id') return { id: source.customer };

        const customer = await stripe.customers.retrieve(source.customer, { stripeAccount: source.stripeAccount });
        return withStripeAccountProperty(customer, source);
      }
    }
  }
};
