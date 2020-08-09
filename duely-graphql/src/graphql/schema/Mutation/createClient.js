import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function createClient(obj, { agencyUuid, name, emailAddress }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        // create client on database
        const res = await client.query('SELECT uuid_ FROM operation_.create_client_($1::uuid, $2::text, $3::text)', [agencyUuid, name, emailAddress]);

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
