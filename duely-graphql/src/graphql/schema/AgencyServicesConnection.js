import { withConnection } from '../../db';
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

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              let sql = 'SELECT * FROM operation_.query_service_by_agency_($1::uuid, $2::text[])';
              const params = [connection.agencyUuid, status ? [status] : null];

              if (uuids != null) {
                sql += ' WHERE uuid_ = ANY ($3::uuid[])';
                params.push(uuids);
              }

              const res = await client.query(sql, params);

              return res.rows.map(row => ({
                agencyUuid: connection.agencyUuid,
                ...row,
                type: 'AgencyServicesEdge'
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
