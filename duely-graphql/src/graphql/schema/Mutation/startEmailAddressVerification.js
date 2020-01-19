import { pool } from '../../../db';
import gmail from '../../../gmail';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';

export default async function startEmailAddressVerification(obj, { emailAddress }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  if (!validator.isEmail(emailAddress))
    return {
      success: false,
      message: `Email address format '${emailAddress}' is invalid.`,
      type: 'StartEmailAddressVerificationResult'
    };

  let verificationCode;

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
    const res = await client.query('SELECT verification_code_ FROM operation_.start_email_address_verification_($1::text)', [emailAddress]);
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

  const messages = await gmail.sendEmailAsAdminDuely({
    to: emailAddress,
    subject: 'Email verification - Sign up for duely.app',
    body: [
      `Your email verification code is ${verificationCode}.`,
    ].join('\r\n')
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