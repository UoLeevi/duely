import { withConnection } from '../../../db';

export default async function deleteServiceStep(obj, { serviceStepUuid }, context, info) {
  if (!context.jwt)
    throw new Error('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        const res = await client.query('SELECT uuid_ FROM operation_.delete_service_step_($1::uuid)', [serviceStepUuid]);

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
