import { withConnection } from '../../../db';

export default async function createClient(obj, { agencyUuid, name, emailAddress }, context, info) {
  if (!context.jwt)
    throw new Error('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        // create client on database
        const res = await client.query('SELECT * FROM operation_.create_client_($1::uuid, $2::text, $3::text)', [agencyUuid, name, emailAddress]);

        // success
        return {
          success: true,
          client: res.rows[0],
          type: 'CreateClientResult'
        };

      } catch (error) {
        return {
          // error
          success: false,
          message: error.message,
          type: 'CreateClientResult'
        };
      }
    });
  });
};
