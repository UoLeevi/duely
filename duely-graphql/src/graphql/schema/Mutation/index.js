import beginVisit from './beginVisit';
import endVisit from './endVisit';
import inviteUser from './inviteUser';
import acceptInvite from './acceptInvite';
import declineInvite from './declineInvite';
import createClient from './createClient';
import createService from './createService';
import createServiceStep from './createServiceStep';
import editAgencyTheme from './editAgencyTheme';
import editImage from './editImage';
import editService from './editService';
import publishService from './publishService';
import unpublishService from './unpublishService';
import deleteAgency from './deleteAgency';
import deleteClient from './deleteClient';
import deleteService from './deleteService';
import deleteServiceStep from './deleteServiceStep';

export default {
  typeDef: `
    type Mutation {
      beginVisit: BeginVisitResult!
      endVisit: EndVisitResult!
      inviteUser(agencyUuid: ID!, emailAddress: String!, role: String!, message: String): InviteUserResult!
      acceptInvite(inviteUuid: ID!): AcceptInviteResult!
      declineInvite(inviteUuid: ID!): DeclineInviteResult!
      createClient(agencyUuid: ID!, name: String!, emailAddress: String): CreateClientResult!
      createService(agencyUuid: ID!, name: String!): CreateServiceResult!
      createServiceStep(serviceUuid: ID!, name: String!, type: ServiceStepType!, previousServiceStepUuid: ID): CreateServiceStepResult!
      editAgencyTheme(agencyUuid: ID!, imageLogoUuid: ID, imageHeroUuid: ID, colorPrimary: String!, colorSecondary: String!, colorAccent: String!, colorBackground: String!, colorSurface: String!, colorError: String!, colorSuccess: String!): EditAgencyThemeResult!
      editImage(agencyUuid: ID!, imageName: String!, imageData: String!, imageColor: String!): EditImageResult!
      editService(serviceUuid: ID!, name: String!, description: String, duration: String, price: Int, currency: String, imageLogoUuid: ID, imageHeroUuid: ID): EditServiceResult!
      publishService(serviceUuid: ID!): SimpleResult!
      unpublishService(serviceUuid: ID!): SimpleResult!
      deleteAgency(agencyUuid: ID!): DeleteResult!
      deleteClient(clientUuid: ID!): DeleteResult!
      deleteService(serviceUuid: ID!): DeleteResult!
      deleteServiceStep(serviceStepUuid: ID!): DeleteResult!
    }
  `,
  resolvers: {
    Mutation: {
      beginVisit,
      endVisit,
      inviteUser,
      acceptInvite,
      declineInvite,
      createClient,
      createServiceStep,
      createService,
      editAgencyTheme,
      editImage,
      editService,
      publishService,
      unpublishService,
      deleteAgency,
      deleteClient,
      deleteService,
      deleteServiceStep
    }
  }
};
