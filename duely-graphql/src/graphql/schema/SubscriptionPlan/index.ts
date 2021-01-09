import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResourceAll
} from '../../util';

const resource = {
  name: 'subscription plan',
  table_name: 'subscription_plan'
};

export const SubscriptionPlan = {
  typeDef: `
    type SubscriptionPlan {
      id: ID!
      name: String!
      transaction_fees: [TransactionFee!]!
    }

    input SubscriptionPlanFilter {
      name: String
    }

    extend type Query {
      subscription_plan(id: ID!): SubscriptionPlan
      subscription_plans(filter: SubscriptionPlanFilter!): [SubscriptionPlan!]
    }
  `,
  resolvers: {
    SubscriptionPlan: {
      ...createResolverForReferencedResourceAll({
        name: 'transaction_fees',
        resource_name: 'transaction fee',
        column_name: 'subscription_plan_id'
      })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
