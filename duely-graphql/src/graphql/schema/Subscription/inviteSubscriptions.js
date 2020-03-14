import { withFilter } from 'apollo-server-express';
import { addBackgroundJob, pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';
import pubsub from '../../pubsub';

const INVITE_CREATED = 'INVITE_CREATED';
const INVITE_UPDATED = 'INVITE_UPDATED';
const INVITE_DELETED = 'INVITE_DELETED';

addBackgroundJob(async client => {
  await client.query('LISTEN "application_.user_invite_"');
  client.on('notification', ({ channel, payload }) => {
    if (channel !== 'application_.user_invite_')
      return;

    const { op, uuid_ } = JSON.parse(payload);

    switch (op) {
      case 'I':
        pubsub.publish(INVITE_CREATED, { uuid_ });
        break;

      case 'U':
        pubsub.publish(INVITE_UPDATED, { uuid_ });
        break;

      case 'D':
        pubsub.publish(INVITE_DELETED, { uuid_ });
        break;
    }
  });
});

const inviteCreated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(INVITE_CREATED),
    async (obj, args, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      const client = await pool.connect();
      try {
        await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
        const res = await client.query('SELECT 1 FROM operation_.query_user_invite_($1::uuid)', [obj.uuid_]);
        return res.rows.length === 1;
      }
      catch (error) {
        // Unauthorized (ERRCODE: 42501) is expected if user does not have access
        if (error.code !== '42501')
          console.log(error);

        return false;
      }
      finally {
        await client.query('SELECT operation_.end_session_()');
        client.release();
      }
    }
  ),
  async resolve(obj, args, context, info) {
    const client = await pool.connect();
    try {
      await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
      const res = await client.query('SELECT * FROM operation_.query_user_invite_($1::uuid)', [obj.uuid_]);
      return res.rows[0];
    }
    catch (error) {
      throw new AuthenticationError(error.message);
    }
    finally {
      await client.query('SELECT operation_.end_session_()');
      client.release();
    }
  }
};

const inviteUpdated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(INVITE_UPDATED),
    (obj, { inviteUuids }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return inviteUuids.includes(obj.uuid_);
    }
  ),
  async resolve(obj, args, context, info) {
    const client = await pool.connect();
    try {
      await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
      const res = await client.query('SELECT * FROM operation_.query_user_invite_($1::uuid)', [obj.uuid_]);
      return res.rows[0];
    }
    catch (error) {
      throw new AuthenticationError(error.message);
    }
    finally {
      await client.query('SELECT operation_.end_session_()');
      client.release();
    }
  }
};

const inviteDeleted = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(INVITE_DELETED),
    (obj, { inviteUuids }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return inviteUuids.includes(obj.uuid_);
    }
  ),
  resolve(obj) {
    return obj.uuid_;
  }
};

export {
  inviteCreated,
  inviteUpdated,
  inviteDeleted
};
