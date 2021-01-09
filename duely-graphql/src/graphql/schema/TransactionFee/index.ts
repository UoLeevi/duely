import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';

const resource = {
  name: 'transaction fee',
  table_name: 'transaction_fee'
};

export const TransactionFee = {
  typeDef: `
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
      transaction_fees(filter: TransactionFeeFilter!): [TransactionFee!]
    }
  `,
  resolvers: {
    TransactionFee: {
      ...createResolverForReferencedResource({ name: 'subscription_plan' }),
      percentage(source: { numerator_: number; denominator_: number }) {
        return source.numerator_ / source.denominator_;
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
