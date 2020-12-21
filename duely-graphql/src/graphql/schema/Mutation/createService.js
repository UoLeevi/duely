import { withConnection } from '../../../db';

export default async function createService(obj, { agencyUuid, name }, context, info) {
  if (!context.jwt)
    throw new Error('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        // create service on database
        const res = await client.query('SELECT * FROM operation_.create_service_($1::uuid, $2::text)', [agencyUuid, name]);
        const service = res.rows[0];

        // success
        return {
          success: true,
          service,
          type: 'CreateServiceResult'
        };

      } catch (error) {
        return {
          // error
          success: false,
          message: error.message,
          type: 'CreateServiceResult'
        };
      }
    });
  });
};
