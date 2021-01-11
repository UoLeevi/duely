import { agencyCreated, agencyUpdated, agencyDeleted } from './agencySubscriptions';
import { serviceCreated, serviceUpdated, serviceDeleted } from './serviceSubscriptions';
import { serviceStepCreated, serviceStepUpdated, serviceStepDeleted } from './serviceStepSubscriptions';
import { inviteCreated, inviteUpdated, inviteDeleted } from './inviteSubscriptions';
import gql from 'graphql-tag';

export default {
  typeDef: gql`
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
      inviteCreated: Invite!
      inviteUpdated(inviteUuids: [ID!]!): Invite!
      inviteDeleted(inviteUuids: [ID!]!): ID!
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
      serviceStepDeleted,
      inviteCreated,
      inviteUpdated,
      inviteDeleted
    }
  }
};
