import { agencyCreated, agencyUpdated, agencyDeleted } from './agencySubscriptions';
import { serviceCreated, serviceUpdated, serviceDeleted } from './serviceSubscriptions';
import { serviceStepCreated, serviceStepUpdated, serviceStepDeleted } from './serviceStepSubscriptions';

export default {
  typeDef: `
    type Subscription {
      agencyCreated: Agency!
      agencyUpdated(agencyUuids: [ID!]!): Agency!
      agencyDeleted(agencyUuids: [ID!]!): ID!
      serviceCreated: Service!
      serviceUpdated(serviceUuids: [ID!]!): Service!
      serviceDeleted(serviceUuids: [ID!]!): ID!
      serviceStepCreated: ServiceStep!
      serviceStepUpdated(serviceStepUuids: [ID!]!): ServiceStep!
      serviceStepDeleted(serviceStepUuids: [ID!]!): ID!
    }
  `,
  resolvers: {
    Subscription: {
      agencyCreated,
      agencyUpdated,
      agencyDeleted,
      serviceCreated,
      serviceUpdated,
      serviceDeleted,
      serviceStepCreated,
      serviceStepUpdated,
      serviceStepDeleted
    }
  }
};
