import { withConnection } from '../../db';

export default {
  typeDef: `
    type Invite implements Node {
      uuid: ID!
      name: String!
      status: String
      inviteeEmailAddress: String!
      agency: Agency!
      role: String!
    }
  `,
  resolvers: {
    Invite: {
      uuid: source => source.uuid_,
      name: source => 'user invite',
      status: source => source.status_,
      inviteeEmailAddress: source => source.invitee_email_address_,
      async agency(invite, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [invite.agency_uuid_]);
              return res.rows[0];
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      },
      async role(invite, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_role_($1::uuid)', [invite.role_uuid_]);
              return res.rows[0];
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      }
    }
  }
};
