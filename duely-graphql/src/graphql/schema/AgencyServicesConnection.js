import { pool } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type AgencyServicesConnection implements Connection {
      edges(uuids: [ID!], status: String): [AgencyServicesEdge!]!
    }
  `,
  resolvers: {
    AgencyServicesConnection: {
      async edges(connection, { status, uuids }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

          let sql = 'SELECT * FROM operation_.query_service_by_agency_($1::uuid, $2::text[])';
          const params = [connection.agencyUuid, status ? [status] : null];

          if (uuids != null) {
            sql += ' WHERE uuid_ = ANY ($3::uuid[])';
            params.push(uuids);
          }

          const res = await client.query(sql, params);

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
