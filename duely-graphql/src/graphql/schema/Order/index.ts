import { queryResource, queryResourceAccess, Resources, updateResource } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource,
  createResolverForReferencedResourceAll,
  withStripeAccountProperty
} from '../../util';
import stripe from '@duely/stripe';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'order'
} as const;

export const Order: GqlTypeDefinition<Resources['order']> = {
  typeDef: gql`
    type Order {
      id: ID!
      customer(token: String): Customer!
      items(
        filter: OrderItemFilter
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [OrderItem!]!
      stripe_account: StripeAccount!
      stripe_checkout_session(token: String): StripeCheckoutSession!
      state: String!
      error: String
      ordered_at: DateTime!
      processed_at: DateTime
    }

    input OrderFilter {
      customer_id: ID
      stripe_account_id: ID
      stripe_checkout_session_id_ext: ID
    }

    extend type Query {
      order(id: ID!, token: String): Order
      orders(
        filter: OrderFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Order!]
      count_orders(filter: OrderFilter!, token: String): Int!
    }

    extend type Mutation {
      update_order(order_id: ID!, state: String, processed_at: Int): OrderMutationResult!
    }

    type OrderMutationResult implements MutationResult {
      success: Boolean!
      message: String
      order: Order
    }
  `,
  resolvers: {
    Order: {
      ...createResolverForReferencedResource({ name: 'customer' }),
      ...createResolverForReferencedResource({
        name: 'stripe_account',
        resource_name: 'stripe account'
      }),
      ...createResolverForReferencedResourceAll({
        name: 'items',
        resource_name: 'order item',
        column_name: 'order_id'
      }),
      async stripe_checkout_session(order: Resources['order'], args: { token?: string }, context) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        if (
          !order.stripe_checkout_session_id_ext ||
          args?.token !== order.stripe_checkout_session_id_ext
        ) {
          const access = await queryResourceAccess(context, order.id);

          if (access !== 'owner') {
            throw new DuelyGraphQLError('FORBIDDEN', 'Only owner can access this information');
          }
        }

        try {
          const stripe_account = await queryResource(
            context,
            'stripe account',
            order.stripe_account_id
          );

          const { object, ...stripe_checkout_session } = await stripe
            .get(stripe_account)
            .checkout.sessions.retrieve(order.stripe_checkout_session_id_ext);

          return withStripeAccountProperty(stripe_checkout_session, stripe_account);
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async update_order(obj, { order_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const order = await updateResource(context, 'order', order_id, args);

          // success
          return {
            success: true,
            order,
            type: 'OrderMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'OrderMutationResult'
          };
        }
      }
    }
  }
};
