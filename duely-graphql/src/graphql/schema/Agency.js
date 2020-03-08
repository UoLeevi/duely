import { pool } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

export default {
  typeDef: `
    type Agency implements Node {
      uuid: ID!
      name: String!
      subdomain: Subdomain!
      theme: Theme
      subjectsConnection: AgencySubjectsConnection!
      invitesConnection: AgencyInvitesConnection!
      servicesConnection: AgencyServicesConnection!
    }
  `,
  resolvers: {
    Agency: {
      uuid: source => source.uuid_,
      name: source => source.name_,
      async subdomain(agency, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_subdomain_($1::uuid)', [agency.subdomain_uuid_]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows[0];
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          client.release();
        }
      },
      async theme(agency, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_theme_($1::uuid)', [agency.theme_uuid_]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows.length === 1 ? res.rows[0] : null;
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          client.release();
        }
      },
      subjectsConnection(agency, args, context, info) {
        return { 
          agencyUuid: agency.uuid_,
          type: 'AgencySubjectsConnection'
        };
      },
      invitesConnection(agency, args, context, info) {
        return { 
          agencyUuid: agency.uuid_,
          type: 'AgencyInvitesConnection'
        };
      },
      servicesConnection(agency, args, context, info) {
        return { 
          agencyUuid: agency.uuid_,
          type: 'AgencyServicesConnection'
        };
      }
    }
  }
};
