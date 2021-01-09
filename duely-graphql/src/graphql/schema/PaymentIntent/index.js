// see: https://stripe.com/docs/api/payment_intents/object

import { parseResolveInfo } from 'graphql-parse-resolve-info';
import stripe from '../../../stripe';
import { withStripeAccountProperty } from '../../util';

export const PaymentIntent = {
  typeDef: `
    type PaymentIntent {
      id: ID!
      id_ext: ID!
      amount: Int!
      amount_capturable: Int
      amount_received: Int
      application_fee_amount: Int
      canceled_at: Date
      cancellation_reason: String
      capture_method: String
      charges: [Charge]
      confirmation_method: String
      created: Date
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
  `,
  resolvers: {
    PaymentIntent: {
      id_ext: (source) => source.id,
      created: (source) => new Date(source.created * 1000),
      canceled_at: (source) => new Date(source.created * 1000),
      charges: (source) => withStripeAccountProperty(source.charges?.data, source),
      async customer(source, args, context, info) {
        if (source.customer == null) return null;
        if (typeof source.customer === 'object') return source.customer;

        const stripe_env = source.livemode ? 'live' : 'test';

        const fields = Object.keys(Object.values(parseResolveInfo(info).fieldsByTypeName)[0]);
        if (fields.length === 1 && fields[0] === 'id') return { id: source.customer };

        const customer = await stripe[stripe_env].customers.retrieve(source.customer, {
          stripeAccount: source.stripeAccount
        });
        return withStripeAccountProperty(customer, source);
      }
    }
  }
};
