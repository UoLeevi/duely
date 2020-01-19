import { withFilter } from 'apollo-server-express';
import { getSharedClient, pool } from '../../../db';
import pubsub from '../../pubsub';

const AGENCY_CREATED = 'AGENCY_CREATED';

getSharedClient().then(client => {
  client.query('LISTEN "application_.agency_"');
  client.on('notification', ({ channel, payload }) => {
    if (channel !== 'application_.agency_')
      return;

    const { op, row } = JSON.parse(payload);

    if (op !== 'I')
      return;

    pubsub.publish(AGENCY_CREATED, { agencyCreated: row });
  });
});

export default {
  subscribe: withFilter(
    () => pubsub.asyncIterator(AGENCY_CREATED),
    async (obj, args, context, info) => {
      const client = await pool.connect();
      try {
        await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);
        const res = await client.query('SELECT * FROM operation_.query_agency_($1::uuid)', [obj.agencyCreated.uuid_]);
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
    },
  )
};
