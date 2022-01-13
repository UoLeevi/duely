import gql from 'graphql-tag';
import { queryResourceAll, getServiceAccountContext, Resources } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResourceAll
} from '../../util';
import { convertCurrency } from '../ExchangeRate';
import { DuelyGraphQLError } from '../../errors';
import { GqlTypeDefinition } from '../../types';

const resource = {
  name: 'subscription plan',
  table_name: 'subscription_plan'
} as const;

// By convention all subscriptions use transaction fee percent that applies to 100 € transaction
export async function getTransactionFeePercentForSubscriptions(subscription_plan_id: string) {
  const fee = await calculateTransactionFee(subscription_plan_id, 10000, 'eur');
  return Math.round((fee / 100 + Number.EPSILON) * 100) / 100;
}

export async function calculateTransactionFee(
  subscription_plan_id: string,
  amount: number,
  currency: string
) {
  const context = await getServiceAccountContext();
  if (!context.jwt) throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

  const transaction_fees = await queryResourceAll(context, 'transaction fee', {
    subscription_plan_id: subscription_plan_id as Resources['subscription plan']['id']
  });

  // let's fallback to lowest possible percentage fee
  let application_fee_percent = Math.min(
    ...transaction_fees.map((fee) => fee.numerator / fee.denominator)
  );

  const eurAmount = await convertCurrency(amount, currency);

  if (eurAmount !== null) {
    const applicaple_fee = transaction_fees
      .map((fee) => ({
        ...fee,
        transaction_amount_upper_bound: fee.transaction_amount_upper_bound ?? Infinity
      }))
      .sort((a, b) =>
        a.transaction_amount_upper_bound < b.transaction_amount_upper_bound ? -1 : 1
      )
      .find((fee) => fee.transaction_amount_upper_bound > eurAmount)!;

    application_fee_percent = Math.min(
      1,
      ((applicaple_fee.numerator / applicaple_fee.denominator) * eurAmount +
        applicaple_fee.fixed_amount) /
        eurAmount
    );
  }

  return Math.round(amount * application_fee_percent);
}

export const SubscriptionPlan: GqlTypeDefinition<Resources['subscription plan']> = {
  typeDef: gql`
    type SubscriptionPlan {
      id: ID!
      name: String!
      transaction_fees: [TransactionFee!]!
      calculate_fee(amount: Int!, currency: String!): Int!
      fee_percent_for_subscriptions: Float!
    }

    input SubscriptionPlanFilter {
      name: String
    }

    extend type Query {
      subscription_plan(id: ID!): SubscriptionPlan
      subscription_plans(
        filter: SubscriptionPlanFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [SubscriptionPlan!]
      count_subscription_plans(filter: SubscriptionPlanFilter!, token: String): Int!
    }
  `,
  resolvers: {
    SubscriptionPlan: {
      ...createResolverForReferencedResourceAll({
        name: 'transaction_fees',
        resource_name: 'transaction fee',
        column_name: 'subscription_plan_id'
      }),
      async calculate_fee(
        source: { id: string },
        { amount, currency }: { amount: number; currency: string }
      ) {
        return await calculateTransactionFee(source.id, amount, currency);
      },
      async fee_percent_for_subscriptions(
        source: { id: string }
      ) {
        return await getTransactionFeePercentForSubscriptions(source.id);
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
