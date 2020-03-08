import { pool } from '../../db';
import { AuthenticationError } from 'apollo-server-core';

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
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [invite.agency_uuid_]);
          await client.query('SELECT operation_.end_session_()');
          return res.rows[0];
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
        finally {
          client.release();
        }
      },
      async role(invite, args, context, info) {
        if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

        const client = await pool.connect();
        try {
          await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
          const res = await client.query('SELECT * FROM operation_.query_role_($1::uuid)', [invite.role_uuid_]);
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
