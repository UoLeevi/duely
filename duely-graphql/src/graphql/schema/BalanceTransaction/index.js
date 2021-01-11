// see: https://stripe.com/docs/api/balance_transactions/object
// see also: https://stripe.com/docs/reports/reporting-categories

import gql from 'graphql-tag';

export const BalanceTransaction = {
  typeDef: gql`
    type BalanceTransaction {
      id: ID!
      id_ext: ID!
      amount: Int!
      available_on: Date!
      created: Date!
      exchange_rate: Float
      currency: String!
      description: String
      fee: Int!
      fee_details: [BalanceTransactionFeeDetails!]
      net: Int!
      status: String!
      reporting_category: String!
      type: String!
      source: String!
    }

    type BalanceTransactionFeeDetails {
      amount: Int!
      application: String
      currency: String!
      description: String
      type: String!
    }
  `,
  resolvers: {
    BalanceTransaction: {
      id_ext: (source) => source.id,
      created: (source) => new Date(source.created * 1000),
      available_on: (source) => new Date(source.created * 1000)
    }
  }
};
