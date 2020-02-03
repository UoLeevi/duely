import beginVisit from './beginVisit';
import endVisit from './endVisit';
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

export default {
  typeDef: `
    type Mutation {
      beginVisit: BeginVisitResult!
      endVisit: EndVisitResult!
      signUp(emailAddress: String!, verificationCode: String!, name: String!, password: String!): SignUpResult!
      startEmailAddressVerification(emailAddress: String!): StartEmailAddressVerificationResult!
      logIn(emailAddress: String!, password: String!): LogInResult!
      logOut: LogOutResult!
      createAgency(name: String!, subdomain: String!, countryCode: String!, returnUrl: String!): CreateAgencyResult!
      createService(agencyUuid: ID!, name: String!): CreateServiceResult!
      createServiceStep(serviceUuid: ID!, name: String!, type: ServiceStepType!, previousServiceStepUuid: ID): CreateServiceStepResult!
      editAgencyTheme(agencyUuid: ID!, imageLogoUuid: ID!, imageHeroUuid: ID!, colorPrimary: String!, colorSecondary: String!, colorAccent: String!, colorBackground: String!, colorSurface: String!, colorError: String!, colorSuccess: String!): EditAgencyThemeResult!
      editImage(agencyUuid: ID!, imageName: String!, imageData: String!, imageColor: String!): EditImageResult!
      deleteAgency(agencyUuid: ID!): DeleteAgencyResult!
      deleteService(serviceUuid: ID!): DeleteServiceResult!
    }
  `,
  resolvers: {
    Mutation: {
      beginVisit,
      endVisit,
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
      deleteService
    }
  }
};
