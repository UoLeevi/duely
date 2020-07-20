import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function unpublishService(obj, { serviceUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        // update service on the database
        const res = await client.query('SELECT * FROM operation_.set_service_status_($1::uuid, $2::text)', [serviceUuid, 'draft']);
        const service = res.rows[0];

        // success
        return {
          success: true,
          type: 'SimpleResult'
        };

      } catch (error) {
        return {
          // error
          success: false,
          message: error.message,
          type: 'SimpleResult'
        };
      }
    });
  });
};
