import { agencyCreated, agencyUpdated, agencyDeleted } from './agencySubscriptions';
import { serviceCreated, serviceUpdated, serviceDeleted } from './serviceSubscriptions';

export default {
  typeDef: `
    type Subscription {
      agencyCreated: Agency!
      agencyUpdated(agencyUuids: [ID!]!): Agency!
      agencyDeleted(agencyUuids: [ID!]!): ID!
      serviceCreated: Service!
      serviceUpdated(serviceUuids: [ID!]!): Service!
      serviceDeleted(serviceUuids: [ID!]!): ID!
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
