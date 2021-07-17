import gql from 'graphql-tag';
import { queryCurrentUser } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResourceAll
} from '../../util';

const resource = {
  table_name: 'user',
  name: 'user'
} as const;

export const User: GqlTypeDefinition = {
  typeDef: gql`
    type User implements Node {
      id: ID!
      name: String!
      email_address: String!
      memberships(filter: MembershipFilter): [Membership!]!
    }

    input UserFilter {
      name: String
      email_address: String
    }

    extend type Query {
      current_user: User
      user(id: ID!): User
      users(filter: UserFilter!, token: String, desc: Boolean, order_by: String, limit: Int, after_id: ID): [User!]
    }
  `,
  resolvers: {
    User: {
      ...createResolverForReferencedResourceAll({
        name: 'memberships',
        resource_name: 'membership',
        column_name: 'user_id'
      })
    },
    Query: {
      async current_user(source, args, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');
        return await queryCurrentUser(context);
      },
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
