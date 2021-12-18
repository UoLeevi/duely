// see: https://stripe.com/docs/api/subscription_items

import { Resources } from '@duely/db';
import { timestampToDate } from '@duely/util';
import gql from 'graphql-tag';
import Stripe from 'stripe';
import { GqlTypeDefinition } from '../../types';
import {
  createStripeRetrieveQueryResolver,
  createStripeRetrieveResolverForReferencedResource,
  withStripeAccountProperty
} from '../../util';

export const SubscriptionItem: GqlTypeDefinition<
  Stripe.SubscriptionItem & { stripe_account: Resources['stripe account'] }
> = {
  typeDef: gql`
    type SubscriptionItem {
      id: ID!
      billing_thresholds: SubscriptionItemBillingThresholds
      created: DateTime!
      # metadata: Stripe.Metadata;
      price: StripePrice
      quantity: Int
      subscription: StripeSubscription!
      # tax_rates: [Stripe.TaxRate> | null;]!
    }

    type SubscriptionItemBillingThresholds {
      usage_gte: Int
    }

    extend type Query {
      subscription_item(stripe_account_id: ID!, subscription_item_id: ID!): SubscriptionItem
      subscription_items(
        stripe_account_id: ID!
        subscription: ID!
        starting_after: String
        ending_before: String
        limit: Int
      ): [SubscriptionItem!]!
    }
  `,
  resolvers: {
    SubscriptionItem: {
      created: (source) => timestampToDate(source.created),
      price: (source) => withStripeAccountProperty(source.price, source.stripe_account),
      ...createStripeRetrieveResolverForReferencedResource({
        name: 'subscription',
        object: 'subscription'
      })
      // async invoiceitems(source, { starting_after_id, ending_before_id, ...args }, context, info) {
      //   if (!context.jwt)
      //     throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

      //   try {
      //     const access = await queryResourceAccess(context, source.stripe_account.id);

      //     if (access !== 'owner') {
      //       throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
      //     }

      //     if (starting_after_id) {
      //       args.starting_after = starting_after_id;
      //     }

      //     if (ending_before_id) {
      //       args.ending_before = ending_before_id;
      //     }

      //     // see: https://stripe.com/docs/api/invoiceitems/list
      //     const list = await stripe.get(source.stripe_account).invoiceItems.list({
      //       customer: source.id,
      //       ...args
      //     });

      //     return withStripeAccountProperty(list.data, source.stripe_account);
      //   } catch (error: any) {
      //     throw new Error(error.message);
      //   }
      // }
    },
    Query: {
      ...createStripeRetrieveQueryResolver({
        name: 'subscription',
        object: 'subscription'
      })
    }
  }
};
