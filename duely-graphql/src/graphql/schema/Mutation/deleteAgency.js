import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function deleteAgency(obj, { agencyUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT uuid_ FROM operation_.delete_agency_($1::uuid)', [agencyUuid]);

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
