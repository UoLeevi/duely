import { withConnection } from '../../db';

export default {
  typeDef: `
    type SubjectAgenciesConnection implements Connection {
      edges(uuids: [ID!]): [SubjectAgenciesEdge!]!
    }
  `,
  resolvers: {
    SubjectAgenciesConnection: {
      async edges(connection, { uuids }, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        if (connection.subjectType === 'visitor')
          return [];

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              let sql = 'SELECT * FROM operation_.query_shared_agency_($1::uuid)';
              const params = [connection.subjectUuid];

              if (uuids != null) {
                if (uuids.length === 1) {
                  sql = 'SELECT * FROM operation_.query_shared_agency_($1::uuid, $2::uuid)';
                  params.push(uuids[0]);
                } else {
                  sql += ' WHERE uuid_ = ANY ($2::uuid[])';
                  params.push(uuids);
                }
              }

              const res = await client.query(sql, params);

              return res.rows.map(row => ({
                subjectUuid: connection.subjectUuid,
                ...row,
                type: 'SubjectAgenciesEdge'
              }));
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      }
    }
  }
};
