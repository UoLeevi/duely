import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function deleteServiceStep(obj, { serviceStepUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT uuid_ FROM operation_.delete_service_step_($1::uuid)', [serviceStepUuid]);

        // success
        return {
          success: true,
          serviceStepUuid: res.rows[0].uuid_,
          type: 'DeleteServiceStepResult'
        };

      } catch (error) {
        return {
          // error
          success: false,
          message: error.message,
          type: 'DeleteServiceStepResult'
        };
      }
    });
  });
};
