// see: https://stripe.com/docs/api/payment_intents/object

import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import gql from 'graphql-tag';
import stripe from '../../../stripe';
import { GqlTypeDefinition } from '../../types';
import { withStripeAccountProperty } from '../../util';

export const PaymentIntent: GqlTypeDefinition = {
  typeDef: gql`
    type PaymentIntent {
      id: ID!
      id_ext: ID!
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

        const resolveTree = parseResolveInfo(info) as ResolveTree;
        const fields = Object.keys(Object.values(resolveTree.fieldsByTypeName)[0]);
        if (fields.length === 1 && fields[0] === 'id') return { id: source.customer };

        const customer = await stripe[stripe_env].customers.retrieve(source.customer, {
          stripeAccount: source.stripeAccount
        });
        return withStripeAccountProperty(customer, source);
      }
    }
  }
};
