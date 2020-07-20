import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function me(obj, args, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT * FROM operation_.query_active_subject_()');
        return res.rows ? res.rows[0] : null;
      } catch (error) {
        throw new AuthenticationError(error.message);
      }
    });
  });
};
