import pool from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type Service implements Node {
      uuid: ID!
      name: String!
      status: String!
      agency: Agency!
    }
  `,
  resolvers: {
    Service: {
      uuid: service => service.uuid_,
      name: service => service.name_,
      status: service => service.status_,
      async agency(service, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [service.agency_uuid_]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows[0];
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
