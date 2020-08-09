import { withConnection } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';

export default async function createClient(obj, { agencyUuid, name }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        // create client on database
        const res = await client.query('SELECT uuid_ FROM operation_.create_client_($1::uuid, $2::text, $2::text)', [agencyUuid, name, emailAddress]);
        const client = res.rows[0];

        // success
        return {
          success: true,
          client,
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
