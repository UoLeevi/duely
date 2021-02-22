import { queryResource, queryResourceAccess, updateResource } from '@duely/db';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResource
} from '../../util';
import stripe from '../../../stripe';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';

const resource = {
  name: 'order'
};

export const Order: GqlTypeDefinition = {
  typeDef: gql`
    type Order {
      id: ID!
      customer: Customer!
      stripe_account: StripeAccount!
      stripe_checkout_session: StripeCheckoutSession!
      state: String!
      error: String
      ordered_at: DateTime!
      processed_at: DateTime
    }

    input OrderFilter {
      customer_id: ID
      stripe_account_id: ID
    }

    extend type Query {
      order(id: ID!): Order
      orders(filter: OrderFilter!): [Order!]
    }

    extend type Mutation {
      update_order(order_id: ID!, state: String, processed_at: DateTime): OrderMutationResult!
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
      ...createResolverForReferencedResource({ name: 'stripe_account' }),
      async stripe_checkout_session(order, args, context) {
        if (!context.jwt) throw new Error('Unauthorized');

        const access = await queryResourceAccess(context, order.id);

        if (access !== 'owner') {
          throw new Error('Only owner can access this information');
        }

        try {
          const stripe_account = await queryResource(context, order.stripe_account_id);
          const stripe_env = stripe_account.livemode ? 'live' : 'test';

          const { id, object, ...stripe_checkout_session } = await stripe[
            stripe_env
          ].checkout.sessions.retrieve(order.stripe_checkout_session_id_ext);

          return {
            stripeAccount: stripe_account.stripe_id_ext,
            ...stripe_checkout_session
          };
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },
    Query: {
      ...createDefaultQueryResolversForResource(resource)
    },
    Mutation: {
      async update_order(obj, { order_id, ...args }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          const order = await updateResource(context, order_id, args);

          // success
          return {
            success: true,
            order,
            type: 'OrderMutationResult'
          };
        } catch (error) {
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
