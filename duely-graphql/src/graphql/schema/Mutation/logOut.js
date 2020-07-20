import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function logOut(obj, args, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT operation_.log_out_user_()');
        return {
          success: true,
          type: 'LogOutResult'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          type: 'LogOutResult'
        };
      }
    });
  });
};
