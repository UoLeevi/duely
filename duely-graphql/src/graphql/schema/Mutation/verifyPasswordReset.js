import { pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function verifyPasswordReset(obj, { verificationCode, password }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
    const res = await client.query('SELECT operation_.reset_password_($1::text, $2::text) jwt_', [verificationCode, password]);
    await client.query('SELECT operation_.end_session_()');
    return {
      success: true,
      jwt: res.rows[0].jwt_,
      type: 'VerifyPasswordResetResult'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message, // `Unable to complete password reset for for '${emailAddress}'. It might be that the verification code was incorrect.`,
      type: 'VerifyPasswordResetResult'
    };
  }
  finally {
    client.release();
  }
};
