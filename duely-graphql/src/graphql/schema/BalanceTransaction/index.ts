// see: https://stripe.com/docs/api/balance_transactions/object
// see also: https://stripe.com/docs/reports/reporting-categories

import { Resources } from '@duely/db';
import gql from 'graphql-tag';
import Stripe from 'stripe';
import { GqlTypeDefinition } from '../../types';
import { timestampToDate } from '@duely/util';

export const BalanceTransaction: GqlTypeDefinition<
  Stripe.BalanceTransaction & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type BalanceTransaction {
      id: ID!
      id_ext: ID!
      amount: Int!
      available_on: DateTime!
      created: DateTime!
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
      created: (source) => timestampToDate(source.created),
      available_on: (source) => timestampToDate(source.created)
    }
  }
};
