import gql from 'graphql-tag';
import { logIn, logOut } from '@duely/db';
import { GqlTypeDefinition } from '../../types';

export const LogIn: GqlTypeDefinition = {
  typeDef: gql`
    extend type Mutation {
      log_in(email_address: String!, password: String!): LogInResult!
      log_out: SimpleResult!
    }

    type LogInResult implements MutationResult {
      success: Boolean!
      message: String
      jwt: String
    }
  `,
  resolvers: {
    Mutation: {
      async log_in(obj, { email_address, password }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          return {
            success: true,
            jwt: await logIn(context, email_address, password),
            type: 'LogInResult'
          };
        } catch (error) {
          return {
            success: false,
            message: error.message, // `Your email or password was invalid. Please try again.`
            type: 'LogInResult'
          };
        }
      },
      async log_out(obj, args, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          await logOut(context);
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
      }
    }
  }
};
