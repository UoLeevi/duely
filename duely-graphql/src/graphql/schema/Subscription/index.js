import { agencyCreated, agencyUpdated, agencyDeleted } from './agencySubscriptions';
import { serviceCreated, serviceUpdated, serviceDeleted } from './serviceSubscriptions';

export default {
  typeDef: `
    type Subscription {
      agencyCreated: Agency!
      agencyUpdated(agencyUuid: ID!): Agency!
      agencyDeleted(agencyUuid: ID!): ID!
      serviceCreated: Service!
      serviceUpdated(serviceUuid: ID!): Service!
      serviceDeleted(serviceUuid: ID!): ID!
    }
  `,
  resolvers: {
    Subscription: {
      agencyCreated,
      agencyUpdated,
      agencyDeleted,
      serviceCreated,
      serviceUpdated,
      serviceDeleted
    }
  }
};
