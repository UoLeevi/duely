import { withConnection, queryResource, queryResourceAll, createResource, updateResource, deleteResource } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

const resource_name = 'user';

export const User = {
  typeDef: `
    extend type Query {
      current_user: User
      user(id: ID!): User
      users(filter: UserFilter!): [User!]
    }

    type User {
      id: ID!
      name: String!
      email_address: String!
    }

    input UserFilter {
      name: String
      email_address: String
    }
  `,
  resolvers: {
    Query: {
      async current_user(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_current_user_()');
              return res.rows[0].query_current_user_
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      },
      async user(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              return await queryResource(client, args.id);
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      },
      async users(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              return await queryResourceAll(client, resource_name, args.filter);
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      }
    }
  }
};
