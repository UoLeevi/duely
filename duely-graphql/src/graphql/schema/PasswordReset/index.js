import { withConnection } from '../../../db';
import gmail from '../../../gmail';
import { p, br, strong, em, a } from '../../../gmail/utilities';
import validator from 'validator';

const resource_name = 'password reset';

export const PasswordReset = {
  typeDef: `
    extend type Mutation {
      start_password_reset(email_address: String!, redirect_url: String): SimpleResult!
      verify_password_reset(verification_code: String!, password: String!): SimpleResult!
    }
  `,
  resolvers: {
    Mutation: {
      async start_password_reset(source, { email_address, redirect_url }, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        if (!validator.isEmail(email_address))
          return {
            success: false,
            message: `Email address '${email_address}' format is invalid.`,
            type: 'SimpleResult'
          };

        email_address = validator.normalizeEmail(email_address);

        if (redirect_url) {
          if (!validator.isURL(redirect_url, { require_tld: false, protocols: ['http', 'https'], require_protocol: true, allow_underscores: true }))
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
          password_reset = await withConnection(context, async withSession => {
            return await withSession(async ({ createResource }) => {
              return await createResource(resource_name, { email_address, data: { redirect_url: redirect_url.href } });
            });
          });

          if (!password_reset) {
            // No user with specified email address exists.
            // Let's anyway send a successful result to not tell if user exists or not.
            return {
              success: true,
              type: 'SimpleResult'
            };
          }

        } catch (error) {
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

        const messages = await gmail.sendEmailAsAdminDuely({
          to: email_address,
          subject: 'Verify your email for Duely',
          body: (redirect_url
            ? [
              p`Hi, 👋`,
              p`Click the link below to verify your email address for Duely.${br``}* this link ${strong`expires in 24 hours`}. After that you will need to request another link.${br``}* this link ${strong`can only be used once`}. After you click the link it will no longer work.`,
              p`${strong`==&gt; ${a`${redirect_url.href}Click here to verify your email and access Duely`}`}`,
              p`${em`This link expires in 24 hours and can only be used once. You can always request another link to be sent if this one has been used or is expired.`}`
            ]
            : [
              p`Hi, 👋`,
              p`Your password reset verification code is ${strong`${password_reset.verification_code}`}.`,
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
      async verify_password_reset(source, { verification_code, password }, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        try {
          return await withConnection(context, async withSession => {
            return await withSession(async ({ queryResource, updateResource }) => {
              let password_reset = await queryResource(resource_name, { verification_code });

              if (!password_reset?.id) {
                return {
                  success: false,
                  message: 'Verification code is incorrect',
                  type: 'SimpleResult'
                };
              }

              password_reset = await updateResource(password_reset.id, { verification_code, password, verified: true });

              return {
                success: true,
                type: 'SimpleResult'
              };
            });
          });
        } catch (error) {
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
