import { Resources } from '@duely/db';
import gql from 'graphql-tag';
import Stripe from 'stripe';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';

const resource = {
  name: 'transaction fee',
  table_name: 'transaction_fee'
} as const;

export const TransactionFee: GqlTypeDefinition<Resources['transaction fee']> = {
  typeDef: gql`
    type TransactionFee {
      id: ID!
      subscription_plan: SubscriptionPlan!
      percentage: Float!
      fixed_amount: Int!
      currency: String!
      transaction_amount_upper_bound: Int!
      data: Json!
    }

    input TransactionFeeFilter {
      subscription_plan_id: ID
    }

    extend type Query {
      transaction_fee(id: ID!): TransactionFee
      transaction_fees(
        filter: TransactionFeeFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [TransactionFee!]
      count_transaction_fees(filter: TransactionFeeFilter!, token: String): Int!
    }
  `,
  resolvers: {
    TransactionFee: {
      ...createResolverForReferencedResource({
        name: 'subscription_plan',
        resource_name: 'subscription plan'
      }),
      percentage(source: { numerator: number; denominator: number }) {
        return source.numerator / source.denominator;
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
