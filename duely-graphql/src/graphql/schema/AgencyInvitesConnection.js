import { withConnection } from '../../db';

export default {
  typeDef: `
    type AgencyInvitesConnection implements Connection {
      edges(uuids: [ID!]): [AgencyInvitesEdge!]!
    }
  `,
  resolvers: {
    AgencyInvitesConnection: {
      async edges(connection, { uuids }, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              let sql = 'SELECT * FROM operation_.query_user_invite_by_agency_($1::uuid)';
              const params = [connection.agencyUuid];

              if (uuids != null) {
                sql += ' WHERE uuid_ = ANY ($2::uuid[])';
                params.push(uuids);
              }

              const res = await client.query(sql, params);
              return res.rows.map(row => ({
                agencyUuid: connection.agencyUuid,
                ...row,
                type: 'AgencyInvitesEdge'
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
