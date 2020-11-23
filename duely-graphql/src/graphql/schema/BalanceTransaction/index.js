import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';
import stripe from '../../../stripe';

// see: https://stripe.com/docs/api/balance_transactions/object

export const BalanceTransaction = {
  typeDef: `
    type BalanceTransaction {
      id: ID!
      id_ext: ID!
      amount: Int!
      available_on: Date!
      created: Date!
      currency: String!
      description: String
      fee: Int!
      net: Int!
      status: String!
      type: String!
    }
  `,
  resolvers: {
    BalanceTransaction: {
      id: source => source.stripe_id_ext,
      id_ext: source => source.stripe_id_ext,
      created: source => new Date(source.created * 1000),
      available_on: source => new Date(source.created * 1000)
    }
  }
};
