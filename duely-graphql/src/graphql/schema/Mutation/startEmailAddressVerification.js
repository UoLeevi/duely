import { pool } from '../../../db';
import gmail from '../../../gmail';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';
import escapeHtml from 'escape-html';

export default async function startEmailAddressVerification(obj, { emailAddress, redirectUrl, subjectSuffix, message }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  if (!validator.isEmail(emailAddress))
    return {
      success: false,
      message: `Email address '${emailAddress}' format is invalid.`,
      type: 'StartEmailAddressVerificationResult'
    };

  if (subjectSuffix && /[\r\n]+/.test(subjectSuffix)) {
    return {
      success: false,
      message: `Subject suffix '${subjectSuffix}' format is invalid.`,
      type: 'StartEmailAddressVerificationResult'
    };
  }

  if (redirectUrl) {
    if (!validator.isURL(redirectUrl))
      return {
        success: false,
        message: `URL '${redirectUrl}' format is invalid.`,
        type: 'StartEmailAddressVerificationResult'
      };

      redirectUrl = new URL(redirectUrl);

      if (redirectUrl.protocol === 'https:') {
        if (!/^(?:[^\.]+\.)?duely\.app$/.test(redirectUrl.hostname)) {
          // TODO: check if external domain is known by duely

          return {
            success: false,
            message: `URL '${redirectUrl}' is invalid. Redirect URL is not known by Duely.`,
            type: 'StartEmailAddressVerificationResult'
          };
        }
      } else if (redirectUrl.protocol === 'http:') {
        if (redirectUrl.hostname !== 'localhost') {
          return {
            success: false,
            message: `URL '${redirectUrl}' is invalid.`,
            type: 'StartEmailAddressVerificationResult'
          };
        }
      } else {
        return {
          success: false,
          message: `URL '${redirectUrl}' is invalid.`,
          type: 'StartEmailAddressVerificationResult'
        };
      }
  }

  let verificationCode;

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
    const res = await client.query('SELECT verification_code_ FROM operation_.start_email_address_verification_($1::text, $2::text)', [emailAddress, redirectUrl ? redirectUrl.href : null]);
    await client.query('SELECT operation_.end_session_()');
    verificationCode = res.rows[0].verification_code_;
  } catch (error) {
    return {
      success: false,
      message: error.message,
      type: 'StartEmailAddressVerificationResult'
    };
  }
  finally {
    client.release();
  }

  if (redirectUrl) {
    redirectUrl.searchParams.set('verification_code', verificationCode);
  }

  const messages = await gmail.sendEmailAsAdminDuely({
    to: emailAddress,
    subject: `Email verification ${ subjectSuffix ? '- ' + subjectSuffix : 'for duely.app' }`,
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
            ? `<a href="${redirectUrl.href}"><strong>Click here to verify</strong></a>`
            : `<p>Your verification code is <strong>${verificationCode}</strong>.</p>`,
          message 
            ? `<p>${escapeHtml(message)}</p>`
            : null,
        '</body>',
      '</html>',
    ].filter(l => l !== null).join('\r\n')
  });

  if (!messages.id)
    return {
      success: false,
      message: `Error while sending verification code email to '${emailAddress}'.`,
      type: 'StartEmailAddressVerificationResult'
    };

  return {
    success: true,
    message: `Verification code sent to '${emailAddress}'.`,
    type: 'StartEmailAddressVerificationResult'
  };
};
