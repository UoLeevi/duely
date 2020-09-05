import { withConnection } from '../../db';
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
      clientsConnection: AgencyClientsConnection!
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

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_subdomain_($1::uuid)', [agency.subdomain_uuid_]);
              return res.rows[0];
            } catch (error) {
              throw new AuthenticationError(error.message);
            }
          });
        });
      },
      async theme(agency, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_theme_($1::uuid)', [agency.theme_uuid_]);
              return res.rows.length === 1 ? res.rows[0] : null;
            } catch (error) {
              throw new AuthenticationError(error.message);
            }
          });
        });
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
      clientsConnection(agency, args, context, info) {
        return { 
          agencyUuid: agency.uuid_,
          type: 'AgencyClientsConnection'
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
