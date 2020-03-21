import { pool } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type SubjectInvitesConnection implements Connection {
      edges(uuids: [ID!]): [SubjectInvitesEdge!]!
    }
  `,
  resolvers: {
    SubjectInvitesConnection: {
      async edges(connection, { uuids }, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        if (connection.subjectType === 'visitor')
          return [];

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

          let sql = 'SELECT * FROM operation_.query_user_invite_by_subject_($1::uuid)';
          const params = [connection.subjectUuid];

          if (uuids != null) {
            sql += ' WHERE uuid_ = ANY ($2::uuid[])';
            params.push(uuids);
          }

          const res = await client.query(sql, params);

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
