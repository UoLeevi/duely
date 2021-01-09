import { withConnection } from '../../../db';
import gmail from '../../../gmail';
import { p, br, strong, em, a } from '../../../gmail/utilities';
import validator from 'validator';

const resource_name = 'sign up';

export const SignUp = {
  typeDef: `
    extend type Mutation {
      start_sign_up(email_address: String!, password: String!, name: String!, redirect_url: String): SimpleResult!
      verify_sign_up(verification_code: String!): SimpleResult!
    }
  `,
  resolvers: {
    Mutation: {
      async start_sign_up(source, { email_address, password, name, redirect_url }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

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

        let sign_up;

        try {
          sign_up = await withConnection(context, async (withSession) => {
            return await withSession(async ({ createResource }) => {
              return await createResource(resource_name, {
                name,
                password,
                email_address,
                data: { redirect_url: redirect_url.href }
              });
            });
          });
        } catch (error) {
          return {
            success: false,
            message: error.message,
            type: 'SimpleResult'
          };
        }

        if (redirect_url) {
          redirect_url.searchParams.set('verification_code', sign_up.verification_code);
          redirect_url.searchParams.set('verify', 'sign_up');
        }

        const messages = await gmail.sendEmailAsAdminDuely({
          to: email_address,
          subject: 'Verify your email for Duely',
          body: (redirect_url
            ? [
                p`Hi, ${validator.escape(name)}! 👋`,
                p`Click the link below to verify your email address for Duely.${br``}* this link ${strong`expires in 24 hours`}. After that you will need to request another link.${br``}* this link ${strong`can only be used once`}. After you click the link it will no longer work.`,
                p`${strong`==&gt; ${a`${redirect_url.href}Click here to verify your email and access Duely`}`}`,
                p`${em`This link expires in 24 hours and can only be used once. You can always request another link to be sent if this one has been used or is expired.`}`
              ]
            : [
                p`Hi, ${validator.escape(name)}! 👋`,
                p`Your sign up verification code is ${strong`${sign_up.verification_code}`}.`,
                p`${em`This code expires in 24 hours and can only be used once. You can always request another verification code to be sent if this one has been used or is expired.`}`
              ]
          ).join('\r\n')
        });

        if (!messages.id)
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
      },
      async verify_sign_up(source, { verification_code }, context, info) {
        if (!context.jwt) throw new Error('Unauthorized');

        try {
          return await withConnection(context, async (withSession) => {
            return await withSession(async ({ queryResource, updateResource }) => {
              let sign_up = await queryResource(resource_name, { verification_code });

              if (!sign_up?.id) {
                return {
                  success: false,
                  message: 'Verification code is incorrect',
                  type: 'SimpleResult'
                };
              }

              sign_up = await updateResource(sign_up.id, { verification_code, verified: true });

              return {
                success: true,
                type: 'SimpleResult'
              };
            });
          });
        } catch (error) {
          return {
            success: false,
            message: error.message, // `Unable to complete sign up an account for '${emailAddress}'. It might be that the verification code was incorrect.`,
            type: 'SimpleResult'
          };
        }
      }
    }
  }
};
