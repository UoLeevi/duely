import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function deleteClient(obj, { clientUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT uuid_ FROM operation_.delete_client_($1::uuid)', [clientUuid]);

        // success
        return {
          success: true,
          uuid: res.rows[0].uuid_,
          type: 'DeleteResult'
        };

      } catch (error) {
        return {
          // error
          success: false,
          message: error.message,
          type: 'DeleteResult'
        };
      }
    });
  });
};