import gql from 'graphql-tag';
import { logIn, logOut } from '@duely/db';
import { GqlTypeDefinition } from '../../types';
import { URL } from 'url';
import axios from 'axios';
import { DuelyGraphQLError } from '../../errors';

export const LogIn: GqlTypeDefinition = {
  typeDef: gql`
    extend type Mutation {
      log_in(
        email_address: String!,
        password: String!,
        recaptcha_token: String): LogInResult!
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
      async log_in(obj, { email_address, password, recaptcha_token }, context, info) {
        if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");

        if (recaptcha_token && process.env.RECAPTCHA_SECRET_KEY) {
          // https://developers.google.com/recaptcha/docs/verify
          const url = new URL('https://www.google.com/recaptcha/api/siteverify');
          url.searchParams.set('secret', process.env.RECAPTCHA_SECRET_KEY);
          url.searchParams.set('response', recaptcha_token);
          
          if (context.ip) {
            url.searchParams.set('remoteip', context.ip);
          }

          const response = await axios.post(url.toString());

          if (!response.data.success) {
            return {
              success: false,
              message: 'reCAPTCHA token was invalid.',
              type: 'SimpleResult'
            };
          }

          const score = response.data.score;

          // TODO: Use the score in better way
          if (!score || score < 0.5) {
            return {
              success: false,
              message: 'We are suspecting you are a bot and the sign up process was not started.',
              type: 'SimpleResult'
            };
          }
        }

        try {
          return {
            success: true,
            jwt: await logIn(context, email_address, password),
            type: 'LogInResult'
          };
        } catch (error: any) {
          return {
            success: false,
            message: error.message, // `Your email or password was invalid. Please try again.`
            type: 'LogInResult'
          };
        }
      },
      async log_out(obj, args, context, info) {
        if (!context.jwt) throw new DuelyGraphQLError("UNAUTHENTICATED", "JWT token was not provided");

        try {
          await logOut(context);
          return {
            success: true,
            type: 'SimpleResult'
          };
        } catch (error: any) {
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
