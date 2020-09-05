import { withConnection } from '../../db';
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

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              let sql = 'SELECT * FROM operation_.query_user_invite_by_subject_($1::uuid)';
              const params = [connection.subjectUuid];

              if (uuids != null) {
                sql += ' WHERE uuid_ = ANY ($2::uuid[])';
                params.push(uuids);
              }

              const res = await client.query(sql, params);

              return res.rows.map(row => ({
                subjectUuid: connection.subjectUuid,
                ...row,
                type: 'SubjectInvitesEdge'
              }));
            } catch (error) {
              throw new AuthenticationError(error.message);
            }
          });
        });
      }
    }
  }
};
