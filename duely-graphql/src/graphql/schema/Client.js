import { withConnection } from '../../db';

export default {
  typeDef: `
    type Client implements Node {
      uuid: ID!
      agency: Agency!
      name: String!
      emailAddress: String
      invite: Invite
      subject: Subject
    }
  `,
  resolvers: {
    Client: {
      uuid: source => source.uuid_,
      name: source => source.name_,
      emailAddress: source => source.email_address_,
      async agency(source, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [source.agency_uuid_]);
              return res.rows.length === 1 ? res.rows[0] : null;
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      },
      async invite(source, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        if (!source.invite_uuid_) return null;

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_user_invite_($1::uuid)', [source.invite_uuid_]);
              return res.rows[0];
            } catch (error) {
              throw new Error(error.message);
            }
          });
        });
      },
      async subject(source, args, context, info) {
        if (!context.jwt)
          throw new Error('Unauthorized');

        if (!source.subject_uuid_) return null;

        return await withConnection(context, async withSession => {
          return await withSession(async client => {
            try {
              const res = await client.query('SELECT * FROM operation_.query_agency_user_($1::uuid, $2::uuid)', [source.agency_uuid_, source.subject_uuid_]);
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
