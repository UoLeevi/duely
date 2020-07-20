import { withConnection } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type Subdomain implements Node {
      uuid: ID!
      name: String!
      agency: Agency!
    }
  `,
  resolvers: {
    Subdomain: {
      uuid: source => source.uuid_,
      name: source => source.name_,
      async agency(subdomain, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_agency_by_subdomain_name_($1::text)', [subdomain.name_]);
              return res.rows[0];
            } catch (error) {
              throw new AuthenticationError(error.message);
            }
          });
        });
      }
    }
  }
};
