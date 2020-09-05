import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export const User = {
  typeDef: `
    extend type Query {
      user(id: ID!): User
    }

    type User {
      id: ID!
      name: String!
      email_address: String!
    }
  `,
  resolvers: {
    Query: {
      async user(source, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_resource_($1::text)', [args.id]);
              return res.rows[0];
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      },
    }
  }
};
