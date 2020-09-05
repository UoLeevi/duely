import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function logIn(obj, { emailAddress, password }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT operation_.log_in_user_($1::text, $2::text) jwt_', [emailAddress, password]);
        return {
          success: true,
          jwt: res.rows[0].jwt_,
          type: 'LogInResult'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message, // `Your email or password was invalid. Please try again.`
          type: 'LogInResult'
        };
      }
    });
  });
};
