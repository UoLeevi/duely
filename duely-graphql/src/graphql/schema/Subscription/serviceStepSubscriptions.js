import { withFilter } from 'apollo-server-express';
import { addBackgroundJob, pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';
import pubsub from '../../pubsub';

const SERVICE_STEP_CREATED = 'SERVICE_STEP_CREATED';
const SERVICE_STEP_UPDATED = 'SERVICE_STEP_UPDATED';
const SERVICE_STEP_DELETED = 'SERVICE_STEP_DELETED';

addBackgroundJob(async client => {
  await client.query('LISTEN "application_.service_step_"');
  client.on('notification', ({ channel, payload }) => {
    if (channel !== 'application_.service_step_')
      return;

    const { op, uuid_ } = JSON.parse(payload);

    switch (op) {
      case 'I':
        pubsub.publish(SERVICE_STEP_CREATED, { uuid_ });
        break;

      case 'U':
        pubsub.publish(SERVICE_STEP_UPDATED, { uuid_ });
        break;

      case 'D':
        pubsub.publish(SERVICE_STEP_DELETED, { uuid_ });
        break;
    }
  });
});

const serviceStepCreated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(SERVICE_STEP_CREATED),
    async (obj, args, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      const client = await pool.connect();
      try {
        await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
        const res = await client.query('SELECT 1 FROM operation_.query_service_step_($1::uuid)', [obj.uuid_]);
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
  ),
  async resolve(obj, args, context, info) {
    const client = await pool.connect();
    try {
      await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
      const res = await client.query('SELECT * FROM operation_.query_service_step_($1::uuid)', [obj.uuid_]);
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

const serviceStepUpdated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(SERVICE_STEP_UPDATED),
    (obj, { serviceStepUuids }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return serviceStepUuids.includes(obj.uuid_);
    }
  ),
  async resolve(obj, args, context, info) {
    const client = await pool.connect();
    try {
      await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
      const res = await client.query('SELECT * FROM operation_.query_service_step_($1::uuid)', [obj.uuid_]);
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

const serviceStepDeleted = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(SERVICE_STEP_DELETED),
    (obj, { serviceStepUuids }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return serviceStepUuids.includes(obj.uuid_);
    }
  ),
  resolve(obj) {
    return obj.uuid_;
  }
};

export {
  serviceStepCreated,
  serviceStepUpdated,
  serviceStepDeleted
};
