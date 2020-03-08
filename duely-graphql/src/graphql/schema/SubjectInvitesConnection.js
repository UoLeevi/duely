import { pool } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type SubjectInvitesConnection implements Connection {
      edges: [SubjectInvitesEdge!]!
    }
  `,
  resolvers: {
    SubjectInvitesConnection: {
      async edges(connection, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (connection.subjectType === 'visitor')
          return [];

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_user_invites_by_subject_($1::uuid)', [connection.subjectUuid]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows.map(row => ({
            subjectUuid: connection.subjectUuid,
            ...row,
            type: 'SubjectInvitesEdge'
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
