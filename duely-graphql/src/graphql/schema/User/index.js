import { withConnection } from '../../../db';
import { createDefaultQueryResolversForResource } from '../../utils';
import { AuthenticationError } from 'apollo-server-core';

const resource = {
  table_name: 'user',
  name: 'user'
};

export const User = {
  typeDef: `
    type User implements Node {
      id: ID!
      name: String!
      email_address: String!
      memberships: [Membership!]!
    }

    input UserFilter {
      name: String
      email_address: String
    }

    extend type Query {
      current_user: User
      user(id: ID!): User
      users(filter: UserFilter!): [User!]
    }
  `,
  resolvers: {
    User: {
      async memberships(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResourceAll }) => {
              return await queryResourceAll('membership', { user_id: source.id });
            });
          });
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },
    Query: {
      async current_user(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ query }) => {
              return await query('SELECT * FROM operation_.query_current_user_()');
            });
          });
        } catch (error) {
          throw new Error(error.message);
        }
      },
      ...createDefaultQueryResolversForResource(resource)
    }
  }
};
