import { withFilter } from 'apollo-server-express';
import { getSharedClient, pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';
import pubsub from '../../pubsub';

const SERVICE_CREATED = 'SERVICE_CREATED';
const SERVICE_UPDATED = 'SERVICE_UPDATED';
const SERVICE_DELETED = 'SERVICE_DELETED';

getSharedClient().then(client => {
  client.query('LISTEN "application_.service_"');
  client.on('notification', ({ channel, payload }) => {
    if (channel !== 'application_.service_')
      return;

    const { op, uuid_ } = JSON.parse(payload);

    switch (op) {
      case 'I':
        pubsub.publish(SERVICE_CREATED, { uuid_ });
        break;

      case 'U':
        pubsub.publish(SERVICE_UPDATED, { uuid_ });
        break;

      case 'D':
        pubsub.publish(SERVICE_DELETED, { uuid_ });
        break;
    }
  });
});

const serviceCreated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(SERVICE_CREATED),
    async (obj, args, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      const client = await pool.connect();
      try {
        await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
        const res = await client.query('SELECT 1 FROM operation_.query_service_($1::uuid)', [obj.uuid_]);
        return res.rows.length === 1;
      }
      catch (err) {
        console.log(err);
        return false;
      }
      finally {
        await client.query('SELECT operation_.end_session_()');
        client.release();
      }
    }
  )
};

const serviceUpdated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(SERVICE_UPDATED),
    (obj, { serviceUuid }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return obj.uuid_ === serviceUuid;
    }
  )
};

const serviceDeleted = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(SERVICE_DELETED),
    (obj, { serviceUuid }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return obj.uuid_ === serviceUuid;
    }
  )
};

export {
  serviceCreated,
  serviceUpdated,
  serviceDeleted
};
