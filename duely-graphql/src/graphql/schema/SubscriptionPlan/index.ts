import gql from 'graphql-tag';
import { queryResourceAll, getServiceAccountContext, Resources } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResourceAll
} from '../../util';
import { convertCurrency } from '../ExchangeRate';

const resource = {
  name: 'subscription plan',
  table_name: 'subscription_plan'
} as const;

export async function calculateTransactionFee(
  subscription_plan_id: string,
  amount: number,
  currency: string
) {
  const context = await getServiceAccountContext();
  if (!context.jwt) throw new Error('Unauthorized');

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

export const SubscriptionPlan = {
  typeDef: gql`
    type SubscriptionPlan {
      id: ID!
      name: String!
      transaction_fees: [TransactionFee!]!
      calculate_fee(amount: Int!, currency: String!): Int!
    }

    input SubscriptionPlanFilter {
      name: String
    }

    extend type Query {
      subscription_plan(id: ID!): SubscriptionPlan
      subscription_plans(filter: SubscriptionPlanFilter!, token: String, desc: Boolean, order_by: String, limit: Int, before_id: ID, after_id: ID): [SubscriptionPlan!]
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
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
