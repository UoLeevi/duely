//import { withFilter } from 'apollo-server';
import { getSharedClient } from '../../../db';
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
    console.log(row);
  });
});

export default {
  typeDef: `
    type Subscription {
      agencyCreated: Agency
    }
  `,
  resolvers: {
    Subscription: {
      agencyCreated: {
        subscribe() {
          return pubsub.asyncIterator([AGENCY_CREATED]);
        }
      }
    }
  }
};
