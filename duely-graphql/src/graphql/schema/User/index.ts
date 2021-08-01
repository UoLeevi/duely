import gql from 'graphql-tag';
import { queryCurrentUser, Resources } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import {
  createDefaultQueryResolversForResource,
  createResolverForReferencedResourceAll
} from '../../util';
import { DuelyGraphQLError } from '../../errors';

const resource = {
  table_name: 'user',
  name: 'user'
} as const;

export const User: GqlTypeDefinition<Resources['user']> = {
  typeDef: gql`
    type User implements Node {
      id: ID!
      name: String!
      email_address: String!
      memberships(
        filter: MembershipFilter
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [Membership!]!
    }

    input UserFilter {
      name: String
      email_address: String
    }

    extend type Query {
      current_user: User
      user(id: ID!): User
      users(
        filter: UserFilter!
        token: String
        desc: Boolean
        order_by: String
        limit: Int
        offset: Int
        before_id: ID
        after_id: ID
      ): [User!]
      count_users(filter: UserFilter!, token: String): Int!
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
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');
        return await queryCurrentUser(context);
      },
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
