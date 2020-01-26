import beginVisit from './beginVisit';
import endVisit from './endVisit';
import startEmailAddressVerification from './startEmailAddressVerification';
import signUp from './signUp';
import logIn from './logIn';
import logOut from './logOut';
import createAgency from './createAgency';
import editAgencyTheme from './editAgencyTheme';
import deleteAgency from './deleteAgency';

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
      editAgencyTheme(agencyUuid: ID!, imageLogo: String!, imageHero: String!, colorPrimary: String!, colorSecondary: String!, colorAccent: String!, colorBackground: String!, colorSurface: String!, colorError: String!, colorSuccess: String!): EditAgencyThemeResult!
      deleteAgency(agencyUuid: ID!): DeleteAgencyResult!
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
      editAgencyTheme,
      deleteAgency
    }
  }
};
