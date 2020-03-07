import beginVisit from './beginVisit';
import endVisit from './endVisit';
import inviteUser from './inviteUser';
import startEmailAddressVerification from './startEmailAddressVerification';
import signUp from './signUp';
import logIn from './logIn';
import logOut from './logOut';
import createAgency from './createAgency';
import createService from './createService';
import createServiceStep from './createServiceStep';
import editAgencyTheme from './editAgencyTheme';
import editImage from './editImage';
import deleteAgency from './deleteAgency';
import deleteService from './deleteService';
import deleteServiceStep from './deleteServiceStep';

export default {
  typeDef: `
    type Mutation {
      beginVisit: BeginVisitResult!
      endVisit: EndVisitResult!
      inviteUser(agencyUuid: ID!, emailAddress: String!, role: String!, message: String): InviteUserResult!
      signUp(emailAddress: String!, verificationCode: String!, name: String!, password: String!): SignUpResult!
      startEmailAddressVerification(emailAddress: String!): StartEmailAddressVerificationResult!
      logIn(emailAddress: String!, password: String!): LogInResult!
      logOut: LogOutResult!
      createAgency(name: String!, subdomain: String!, countryCode: String!, returnUrl: String!): CreateAgencyResult!
      createService(agencyUuid: ID!, name: String!): CreateServiceResult!
      createServiceStep(serviceUuid: ID!, name: String!, type: ServiceStepType!, previousServiceStepUuid: ID): CreateServiceStepResult!
      editAgencyTheme(agencyUuid: ID!, imageLogoUuid: ID, imageHeroUuid: ID, colorPrimary: String!, colorSecondary: String!, colorAccent: String!, colorBackground: String!, colorSurface: String!, colorError: String!, colorSuccess: String!): EditAgencyThemeResult!
      editImage(agencyUuid: ID!, imageName: String!, imageData: String!, imageColor: String!): EditImageResult!
      deleteAgency(agencyUuid: ID!): DeleteAgencyResult!
      deleteService(serviceUuid: ID!): DeleteServiceResult!
      deleteServiceStep(serviceStepUuid: ID!): DeleteServiceStepResult!
    }
  `,
  resolvers: {
    Mutation: {
      beginVisit,
      endVisit,
      inviteUser,
      startEmailAddressVerification,
      signUp,
      logIn,
      logOut,
      createAgency,
      createServiceStep,
      createService,
      editAgencyTheme,
      editImage,
      deleteAgency,
      deleteService,
      deleteServiceStep
    }
  }
};
