import beginVisit from './beginVisit';
import endVisit from './endVisit';
import startEmailAddressVerification from './startEmailAddressVerification';
import signUp from './signUp';
import logIn from './logIn';
import logOut from './logOut';
import createAgency from './createAgency';
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
      createAgency(name: String!, subdomain: String!, countryCode: String!, successUrl: String!, failureUrl: String!): CreateAgencyResult!
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
      deleteAgency
    }
  }
};
