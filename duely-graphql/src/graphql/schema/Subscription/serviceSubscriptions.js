import { withFilter } from 'apollo-server-express';
import { addBackgroundJob, pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';
import pubsub from '../../pubsub';

const SERVICE_CREATED = 'SERVICE_CREATED';
const SERVICE_UPDATED = 'SERVICE_UPDATED';
const SERVICE_DELETED = 'SERVICE_DELETED';

addBackgroundJob(async client => {
  await client.query('LISTEN "application_.service_"');
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

      return await withConnection(context, async withSession => {
        return await withSession(async client => {
          try {
            const res = await client.query('SELECT 1 FROM operation_.query_service_($1::uuid)', [obj.uuid_]);
            return res.rows.length === 1;
          }
          catch (error) {
            // Unauthorized (ERRCODE: 42501) is expected if user does not have access
            if (error.code !== '42501')
              console.log(error);
    
            return false;
          }
        });
      });
    }
  ),
  async resolve(obj, args, context, info) {
    return await withConnection(context, async withSession => {
      return await withSession(async client => {
        try {
          const res = await client.query('SELECT * FROM operation_.query_service_($1::uuid)', [obj.uuid_]);
          return res.rows[0];
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
      });
    });
  }
};

const serviceUpdated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(SERVICE_UPDATED),
    (obj, { serviceUuids }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return serviceUuids.includes(obj.uuid_);
    }
  ),
  async resolve(obj, args, context, info) {
    return await withConnection(context, async withSession => {
      return await withSession(async client => {
        try {
          const res = await client.query('SELECT * FROM operation_.query_service_($1::uuid)', [obj.uuid_]);
          return res.rows[0];
        } catch (error) {
          throw new AuthenticationError(error.message);
        }
      });
    });
  }
};

const serviceDeleted = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(SERVICE_DELETED),
    (obj, { serviceUuids }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return serviceUuids.includes(obj.uuid_);
    }
  ),
  resolve(obj) {
    return obj.uuid_;
  }
};

export {
  serviceCreated,
  serviceUpdated,
  serviceDeleted
};
