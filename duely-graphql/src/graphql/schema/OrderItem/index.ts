import { Resources, updateResource } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  name: 'order item',
  table_name: 'order_item'
} as const;

export const OrderItem: GqlTypeDefinition<Resources['order item']> = {
  typeDef: gql`
    type OrderItem {
      id: ID!
      order(token: String): Order!
      price: Price!
      state: String!
      stripe_line_item_id_ext: String!
      error: String
      processed_at: DateTime
    }

    input OrderItemFilter {
      order_id: ID
      stripe_line_item_id_ext: ID
    }

    extend type Query {
      order_item(id: ID!, token: String): OrderItem
      order_items(
        filter: OrderItemFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [OrderItem!]
      count_order_items(filter: OrderItemFilter!, token: String): Int!
    }

    extend type Mutation {
      update_order_item(
        order_item_id: ID!
        state: String
        processed_at: Int
      ): OrderItemMutationResult!
    }

    type OrderItemMutationResult implements MutationResult {
      success: Boolean!
      message: String
      order_item: OrderItem
    }
  `,
  resolvers: {
    OrderItem: {
      ...createResolverForReferencedResource({ name: 'order' }),
      ...createResolverForReferencedResource({ name: 'price' })
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async update_order_item(obj, { order_id, ...args }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          const order_item = await updateResource(context, 'order item', order_id, args);

          // success
          return {
            success: true,
            order_item,
            type: 'OrderItemMutationResult'
          };
        } catch (error: any) {
          return {
            // error
            success: false,
            message: error.message,
            type: 'OrderItemMutationResult'
          };
        }
      }
    }
  }
};
