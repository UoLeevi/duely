import { withConnection } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

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
          throw new AuthenticationError('Unauthorized');

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
              throw new AuthenticationError(error.message);
            }
          });
        });
      }
    }
  }
};
