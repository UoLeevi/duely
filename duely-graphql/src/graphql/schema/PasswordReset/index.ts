import { createResource, Resources, withSession } from '@duely/db';
import validator from 'validator';
import gql from 'graphql-tag';
import { GqlTypeDefinition } from '../../types';
import { URL } from 'url';
import { DuelyGraphQLError } from '../../errors';
import { sendEmail } from '@duely/email';

const resource_name = 'password reset';

export const PasswordReset: GqlTypeDefinition<Resources['password reset']> = {
  typeDef: gql`
    extend type Mutation {
      start_password_reset(email_address: String!, redirect_url: String): SimpleResult!
      verify_password_reset(verification_code: String!, password: String!): SimpleResult!
    }
  `,
  resolvers: {
    Mutation: {
      async start_password_reset(source, { email_address, redirect_url }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        if (!validator.isEmail(email_address))
          return {
            success: false,
            message: `Email address '${email_address}' format is invalid.`,
            type: 'SimpleResult'
          };

        email_address = validator.normalizeEmail(email_address);

        if (redirect_url) {
          if (
            !validator.isURL(redirect_url, {
              require_tld: false,
              protocols: ['http', 'https'],
              require_protocol: true,
              allow_underscores: true
            })
          )
            return {
              success: false,
              message: `URL '${redirect_url}' format is invalid.`,
              type: 'SimpleResult'
            };

          redirect_url = new URL(redirect_url);

          if (redirect_url.protocol === 'https:') {
            if (!/^(?:[^.]+\.)?duely\.app$/.test(redirect_url.hostname)) {
              // TODO: check if external domain is known by duely

              return {
                success: false,
                message: `URL '${redirect_url}' is invalid. Redirect URL is not known by Duely.`,
                type: 'SimpleResult'
              };
            }
          } else if (redirect_url.hostname !== 'localhost') {
            return {
              success: false,
              message: `URL '${redirect_url}' is invalid.`,
              type: 'SimpleResult'
            };
          }
        }

        let password_reset;

        try {
          password_reset = await createResource(context, resource_name, {
            email_address,
            data: { redirect_url: redirect_url.href }
          });

          if (!password_reset) {
            // No user with specified email address exists.
            // Let's anyway send a successful result to not tell if user exists or not.
            return {
              success: true,
              type: 'SimpleResult'
            };
          }
        } catch (error: any) {
          return {
            success: false,
            message: error.message,
            type: 'SimpleResult'
          };
        }

        if (redirect_url) {
          redirect_url.searchParams.set('verification_code', password_reset.verification_code);
          redirect_url.searchParams.set('verify', 'password_reset');
        }

        try {
          const res = await sendEmail({
            template: 'password-reset',
            from: 'Duely <noreply@duely.app>',
            to: email_address,
            subject: 'Verify your email for Duely',
            context: {
              redirect_url: redirect_url.href,
              verification_code: password_reset.verification_code
            }
          });

          if (!res.success)
            return {
              success: false,
              message: `Error while sending verification code email to '${email_address}'.`,
              type: 'SimpleResult'
            };

          return {
            success: true,
            message: `Verification code sent to '${email_address}'.`,
            type: 'SimpleResult'
          };
        } catch (error) {
          return {
            success: false,
            message: `Error while sending verification code email to '${email_address}'.`,
            type: 'SimpleResult'
          };
        }
      },
      async verify_password_reset(source, { verification_code, password }, context, info) {
        if (!context.jwt)
          throw new DuelyGraphQLError('UNAUTHENTICATED', 'JWT token was not provided');

        try {
          return await withSession(context, async ({ queryResource, updateResource }) => {
            let password_reset = await queryResource(
              resource_name,
              { verification_code },
              verification_code
            );

            if (!password_reset?.id) {
              return {
                success: false,
                message: 'Verification code is incorrect',
                type: 'SimpleResult'
              };
            }

            password_reset = await updateResource('password reset', password_reset.id, {
              verification_code,
              password,
              verified: true
            });

            return {
              success: true,
              type: 'SimpleResult'
            };
          });
        } catch (error: any) {
          return {
            success: false,
            message: error.message, // `Unable to complete password reset an account for '${emailAddress}'. It might be that the verification code was incorrect.`,
            type: 'SimpleResult'
          };
        }
      }
    }
  }
};
