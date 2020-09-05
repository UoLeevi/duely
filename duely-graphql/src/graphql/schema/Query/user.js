import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function user(obj, { emailAddress }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT * FROM operation_.query_user_by_email_address_($1::text)', [emailAddress])
        return res.rows.length === 1 ? res.rows[0] : null;
      } catch (error) {
        throw new AuthenticationError(error.message);
      }
    });
  });
};
