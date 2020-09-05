import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function createServiceStep(obj, { serviceUuid, name, type, previousServiceStepUuid }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        // create service step on database
        const res = await client.query('SELECT * FROM operation_.create_service_step_($1::uuid, $2::text, $3::text, $4::uuid)', [serviceUuid, name, type.toLowerCase(), previousServiceStepUuid]);
        const step = res.rows[0];

        // success
        return {
          success: true,
          step,
          type: 'CreateServiceStepResult'
        };

      } catch (error) {
        return {
          // error
          success: false,
          message: error.message,
          type: 'CreateServiceStepResult'
        };
      }
    });
  });
};
