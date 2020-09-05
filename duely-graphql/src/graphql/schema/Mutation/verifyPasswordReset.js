import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function verifyPasswordReset(obj, { verificationCode, password }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT operation_.reset_password_($1::uuid, $2::text) jwt_', [verificationCode, password]);
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
    });
  });
};
