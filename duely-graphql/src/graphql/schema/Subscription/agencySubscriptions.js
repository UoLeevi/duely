import { withFilter } from 'apollo-server-express';
import { addBackgroundJob, pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';
import pubsub from '../../pubsub';

const AGENCY_CREATED = 'AGENCY_CREATED';
const AGENCY_UPDATED = 'AGENCY_UPDATED';
const AGENCY_DELETED = 'AGENCY_DELETED';

addBackgroundJob(async client => {
  await client.query('LISTEN "application_.agency_"');
  client.on('notification', ({ channel, payload }) => {
    if (channel !== 'application_.agency_')
      return;

    const { op, uuid_ } = JSON.parse(payload);

    switch (op) {
      case 'I':
        pubsub.publish(AGENCY_CREATED, { uuid_ });
        break;

      case 'U':
        pubsub.publish(AGENCY_UPDATED, { uuid_ });
        break;

      case 'D':
        pubsub.publish(AGENCY_DELETED, { uuid_ });
        break;
    }
  });
});

const agencyCreated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(AGENCY_CREATED),
    async (obj, args, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      const client = await pool.connect();
      try {
        await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
        const res = await client.query('SELECT 1 FROM operation_.query_agency_($1::uuid)', [obj.uuid_]);
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
      const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [obj.uuid_]);
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

const agencyUpdated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(AGENCY_UPDATED),
    (obj, { agencyUuids }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return agencyUuids.includes(obj.uuid_);
    }
  ),
  async resolve(obj, args, context, info) {
    const client = await pool.connect();
    try {
      await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
      const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [obj.uuid_]);
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

const agencyDeleted = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(AGENCY_DELETED),
    (obj, { agencyUuids }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return agencyUuids.includes(obj.uuid_);
    }
  ),
  resolve(obj) {
    return obj.uuid_;
  }
};

export {
  agencyCreated,
  agencyUpdated,
  agencyDeleted
};
