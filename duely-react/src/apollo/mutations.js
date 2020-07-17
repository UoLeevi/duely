import { gql } from '@apollo/client';

export const LOG_IN_MUTATION = gql`
  mutation($emailAddress: String!, $password: String!) {
    logIn(emailAddress: $emailAddress, password: $password) {
      success
      message
      jwt
    }
  }
`;

export const LOG_OUT_MUTATION = gql`
  mutation {
    logOut {
      success
      message
    }
  }
`;

export const START_EMAIL_ADDRESS_VERIFICATION_MUTATION = gql`
  mutation($emailAddress: String!, $redirectUrl: String, $subjectSuffix: String, $message: String) {
    startEmailAddressVerification(emailAddress: $emailAddress, redirectUrl: $redirectUrl, subjectSuffix: $subjectSuffix, message: $message) {
      success
      message
    }
  }
`;
