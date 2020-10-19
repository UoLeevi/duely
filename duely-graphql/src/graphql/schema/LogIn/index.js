import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export const LogIn = {
  typeDef: `
    extend type Mutation {
      logIn(email_address: String!, password: String!): LogInResult!
      logOut: SimpleResult!
    }

    type LogInResult implements MutationResult {
      success: Boolean!
      message: String
      jwt: String
    }
  `,
  resolvers: {
    Mutation: {
      async logIn(obj, { email_address, password }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT operation_.log_in_user_($1::text, $2::text) jwt_', [email_address, password]);
              return {
                success: true,
                jwt: res.rows[0].jwt_,
                type: 'LogInResult'
              };
            } catch (error) {
              return {
                success: false,
                message: error.message, // `Your email or password was invalid. Please try again.`
                type: 'LogInResult'
              };
            }
          });
        });
      },
      async logOut(obj, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT operation_.log_out_user_()');
              return {
                success: true,
                type: 'SimpleResult'
              };
            } catch (error) {
              return {
                success: false,
                message: error.message,
                type: 'SimpleResult'
              };
            }
          });
        });
      }
    }
  }
};
