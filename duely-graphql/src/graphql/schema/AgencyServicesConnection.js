import { pool } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type AgencyServicesConnection implements Connection {
      edges(status: String): [AgencyServicesEdge!]!
    }
  `,
  resolvers: {
    AgencyServicesConnection: {
      async edges(connection, { status }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_service_($1::uuid, $2::text[])', [connection.agencyUuid, status ? [status] : null]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows.map(row => ({
            agencyUuid: connection.agencyUuid,
            ...row,
            type: 'AgencyServicesEdge'
          }));
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          client.release();
        }
      }
    }
  }
};
