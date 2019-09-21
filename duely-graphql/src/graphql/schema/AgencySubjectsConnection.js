import pool from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type AgencySubjectsConnection implements Connection {
      edges: [AgencySubjectsEdge!]!
    }
  `,
  resolvers: {
    AgencySubjectsConnection: {
      async edges(connection, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (connection.subjectType === 'visitor')
          return [];

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_agency_user_($1::uuid)', [connection.agencyUuid]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows.map(row => ({
            agencyUuid: connection.agencyUuid,
            ...row,
            type: 'AgencySubjectsEdge'
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
