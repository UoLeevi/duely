import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function deleteService(obj, { serviceUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT uuid_ FROM operation_.delete_service_($1::uuid)', [serviceUuid]);

        // success
        return {
          success: true,
          serviceUuid: res.rows[0].uuid_,
          type: 'DeleteServiceResult'
        };

      } catch (error) {
        return {
          // error
          success: false,
          message: error.message,
          type: 'DeleteServiceResult'
        };
      }
    });
  });
};
