import { withConnection } from '../../db';

export default {
  typeDef: `
    type AgencyClientsConnection implements Connection {
      edges(uuids: [ID!]): [AgencyClientsEdge!]!
    }
  `,
  resolvers: {
    AgencyClientsConnection: {
      async edges(connection, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        if (connection.subjectType === 'visitor')
          return [];

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_client_by_agency_($1::uuid)', [connection.agencyUuid]);
              return res.rows.map(row => ({
                agencyUuid: connection.agencyUuid,
                ...row,
                type: 'AgencyClientsEdge'
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
