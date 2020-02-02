import { withFilter } from 'apollo-server-express';
import { getSharedClient, pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';
import pubsub from '../../pubsub';

const AGENCY_CREATED = 'AGENCY_CREATED';
const AGENCY_UPDATED = 'AGENCY_UPDATED';
const AGENCY_DELETED = 'AGENCY_DELETED';

getSharedClient().then(client => {
  client.query('LISTEN "application_.agency_"');
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
  )
};

const agencyUpdated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(AGENCY_UPDATED),
    (obj, { agencyUuid }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return obj.uuid_ === agencyUuid;
    }
  )
};

const agencyDeleted = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(AGENCY_DELETED),
    (obj, { agencyUuid }, context, info) => {
      if (!context.jwt)
          throw new AuthenticationError('Unauthorized');

      return obj.uuid_ === agencyUuid;
    }
  )
};

export {
  agencyCreated,
  agencyUpdated,
  agencyDeleted
};
