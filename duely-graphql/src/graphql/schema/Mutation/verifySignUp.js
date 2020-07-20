import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function verifySignUp(obj, { verificationCode }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT operation_.sign_up_user_($1::uuid) jwt_', [verificationCode]);

        return {
          success: true,
          jwt: res.rows[0].jwt_,
          type: 'VerifySignUpResult'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message, // `Unable to complete sign up an account for '${emailAddress}'. It might be that the verification code was incorrect.`,
          type: 'VerifySignUpResult'
        };
      }
    });
  });
};
