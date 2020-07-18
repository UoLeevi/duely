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

export const VERIFY_PASSWORD_RESET_MUTATION = gql`
  mutation($verificationCode: String!, $password: String!) {
    verifyPasswordReset(verificationCode: $verificationCode, password: $password) {
      success
      message
      jwt
    }
  }
`;

export const VERIFY_SIGN_UP_MUTATION = gql`
  mutation($verificationCode: String!) {
    verifySignUp(verificationCode: $verificationCode) {
      success
      message
      jwt
    }
  }
`;

export const START_PASSWORD_RESET_MUTATION = gql`
  mutation($emailAddress: String!, $redirectUrl: String) {
    startPasswordReset(emailAddress: $emailAddress, redirectUrl: $redirectUrl) {
      success
      message
    }
  }
`;

export const START_SIGN_UP_MUTATION = gql`
  mutation($emailAddress: String!, $password: String!, $name: String!, $redirectUrl: String) {
    startSignUp(emailAddress: $emailAddress, password: $password, name: $name, redirectUrl: $redirectUrl) {
      success
      message
    }
  }
`;
