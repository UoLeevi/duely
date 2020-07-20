import { withConnection } from '../../../db';
import gmail from '../../../gmail';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';

export default async function startPasswordReset(obj, { emailAddress, redirectUrl }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  if (!validator.isEmail(emailAddress))
    return {
      success: false,
      message: `Email address '${emailAddress}' format is invalid.`,
      type: 'SimpleResult'
    };

  if (redirectUrl) {
    if (!validator.isURL(redirectUrl, { require_tld: false, protocols: ['http', 'https'], require_protocol: true, allow_underscores: true }))
      return {
        success: false,
        message: `URL '${redirectUrl}' format is invalid.`,
        type: 'SimpleResult'
      };

      redirectUrl = new URL(redirectUrl);

      if (redirectUrl.protocol === 'https:') {
        if (!/^(?:[^\.]+\.)?duely\.app$/.test(redirectUrl.hostname)) {
          // TODO: check if external domain is known by duely

          return {
            success: false,
            message: `URL '${redirectUrl}' is invalid. Redirect URL is not known by Duely.`,
            type: 'SimpleResult'
          };
        }
      } else if (redirectUrl.hostname !== 'localhost') {
        return {
          success: false,
          message: `URL '${redirectUrl}' is invalid.`,
          type: 'SimpleResult'
        };
      }
  }

  let verificationCode;
  const json = JSON.stringify({ redirectUrl: redirectUrl ? redirectUrl.href : null });

  try {
    verificationCode = await withConnection(context, async withSession => {
      return await withSession(async client => {
        const res = await client.query('SELECT uuid_ FROM operation_.start_email_address_verification_($1::text, $2::boolean, $3::json)', [emailAddress, true, json]);
        return res.rows[0].uuid_;
      });
    });
  } catch (error) {
    return {
      success: false,
      message: error.message,
      type: 'SimpleResult'
    };
  }

  if (redirectUrl) {
    redirectUrl.searchParams.set('verification_code', verificationCode);
  }

  const messages = await gmail.sendEmailAsAdminDuely({
    to: emailAddress,
    subject: 'Reset password for duely.app',
    body: [
      '<html>',
        '<style type="text/css">',
          'body, p, div {',
          '  font-family: Helvetica, Arial, sans-serif;',
          '  font-size: 14px;',
          '}',
          'a {',
          '  text-decoration: none;',
          '}',
        '</style>',
        '<body>',
          redirectUrl
            ? `<a href="${redirectUrl.href}"><strong>Click here to set a new password</strong></a>`
            : `<p>Your password reset verification code is <strong>${verificationCode}</strong>.</p>`,
        '</body>',
      '</html>',
    ].join('\r\n')
  });

  if (!messages.id)
    return {
      success: false,
      message: `Error while sending verification code email to '${emailAddress}'.`,
      type: 'SimpleResult'
    };

  return {
    success: true,
    message: `Verification code sent to '${emailAddress}'.`,
    type: 'SimpleResult'
  };
};
