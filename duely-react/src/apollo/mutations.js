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
