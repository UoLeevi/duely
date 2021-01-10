import { fetchServiceAccountContext, withConnection } from '../../../db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResourceAll
} from '../../util';
import { convertCurrency } from '../ExchangeRate';

const resource = {
  name: 'subscription plan',
  table_name: 'subscription_plan'
};

export async function calculateTransactionFee(
  subscription_plan_id: string,
  amount: number,
  currency: string
) {
  const context = await fetchServiceAccountContext();
  if (!context.jwt) throw new Error('Unauthorized');

  let transaction_fees: {
    numerator: number;
    denominator: number;
    fixed_amount: number;
    currency: string;
    transaction_amount_upper_bound: number;
  }[];

  try {
    transaction_fees = await withConnection(context, async (withSession) => {
      return await withSession(async ({ queryResourceAll }) => {
        return await queryResourceAll('transaction fee', {
          subscription_plan_id
        });
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }

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
  typeDef: `
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
      subscription_plans(filter: SubscriptionPlanFilter!): [SubscriptionPlan!]
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
