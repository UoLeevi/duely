import { updateResource } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

const resource = {
  name: 'order item',
  table_name: 'order_item'
};

export const OrderItem: GqlTypeDefinition = {
  typeDef: gql`
    type OrderItem {
      id: ID!
      order: Order!
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
      order_item(id: ID!): OrderItem
      order_items(filter: OrderItemFilter!): [OrderItem!]
    }

    extend type Mutation {
      update_order_item(
        order_item_id: ID!
        state: String
        processed_at: DateTime
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
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          const order_item = await updateResource(context, order_id, args);

          // success
          return {
            success: true,
            order_item,
            type: 'OrderItemMutationResult'
          };
        } catch (error) {
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
