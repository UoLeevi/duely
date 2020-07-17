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

export const SIGN_UP_MUTATION = gql`
  mutation($emailAddress: String!, $verificationCode: String!, $name: String!, $password: String!) {
    signUp(emailAddress: $emailAddress, verificationCode: $verificationCode, name: $name, password: $password) {
      success
      message
      jwt
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation($emailAddress: String!, $verificationCode: String!, $password: String!) {
    resetPassword(emailAddress: $emailAddress, verificationCode: $verificationCode, password: $password) {
      success
      message
      jwt
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
