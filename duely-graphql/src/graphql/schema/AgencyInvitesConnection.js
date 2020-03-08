import { pool } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type AgencyInvitesConnection implements Connection {
      edges: [AgencyInvitesEdge!]!
    }
  `,
  resolvers: {
    AgencyInvitesConnection: {
      async edges(connection, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_user_invite_by_agency_($1::uuid)', [connection.agencyUuid]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows.map(row => ({
            agencyUuid: connection.agencyUuid,
            ...row,
            type: 'AgencyInvitesEdge'
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
