// see: https://stripe.com/docs/api/payment_intents/object

import stripe from '../../../stripe';

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
      id_ext: source => source.id,
      created: source => new Date(source.created * 1000),
      canceled_at: source => new Date(source.created * 1000),
      charges: source => source.charges?.data,
      async customer(source) {
        if (source.customer == null) return null;
        if (typeof source.customer === 'object') return source.customer;

        return await stripe.customers.retrieve(source.customer, { stripeAccount: source.stripeAccount });
      }
    }
  }
};
