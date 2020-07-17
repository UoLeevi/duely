import { pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function resetPassword(obj, { emailAddress, verificationCode, password }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
    const res_u = await client.query('SELECT uuid_ FROM operation_.reset_password($1::text, $2::text, $3::text)', [emailAddress, verificationCode, password]);
    const res_l = await client.query('SELECT operation_.log_in_user_($1::text, $2::text) jwt_', [emailAddress, password]);
    await client.query('SELECT operation_.end_session_()');
    return {
      success: true,
      userUuid: res_u.rows[0].uuid_,
      jwt: res_l.rows[0].jwt_,
      type: 'ResetPasswordResult'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message, // `Unable to complete password reset for for '${emailAddress}'. It might be that the verification code was incorrect.`,
      type: 'ResetPasswordResult'
    };
  }
  finally {
    client.release();
  }
};
