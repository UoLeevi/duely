import { gql } from '@apollo/client';
import produce from 'immer';
import queries from 'apollo/queries';

export default {
  logIn: {
    mutation: gql`
      mutation($emailAddress: String!, $password: String!) {
        logIn(emailAddress: $emailAddress, password: $password) {
          success
          message
          jwt
        }
      }
    `, 
    result: d => d['logIn']
  },
  logOut: {
    mutation: gql`
      mutation {
        logOut {
          success
          message
        }
      }
    `, 
    result: d => d['logOut']
  },
  verifyPasswordReset: {
    mutation: gql`
      mutation($verificationCode: String!, $password: String!) {
        verifyPasswordReset(verificationCode: $verificationCode, password: $password) {
          success
          message
          jwt
        }
      }
    `, 
    result: d => d['verifyPasswordReset']
  },
  verifySignUp: {
    mutation: gql`
      mutation($verificationCode: String!) {
        verifySignUp(verificationCode: $verificationCode) {
          success
          message
          jwt
        }
      }
    `, 
    result: d => d['verifySignUp']
  },
  startPasswordReset: {
    mutation: gql`
      mutation($emailAddress: String!, $redirectUrl: String) {
        startPasswordReset(emailAddress: $emailAddress, redirectUrl: $redirectUrl) {
          success
          message
        }
      }
    `,
    result: d => d['startPasswordReset']
  },
  startSignUp: {
    mutation: gql`
      mutation($emailAddress: String!, $password: String!, $name: String!, $redirectUrl: String) {
        startSignUp(emailAddress: $emailAddress, password: $password, name: $name, redirectUrl: $redirectUrl) {
          success
          message
        }
      }
    `,
    result: d => d['startSignUp']
  },
  createAgency: {
    mutation: gql`
      mutation($name: String!, $subdomain: String!, $countryCode: String!, $returnUrl: String!) {
        createAgency(name: $name, subdomain: $subdomain, countryCode: $countryCode, returnUrl: $returnUrl) {
          success
          message
          agency {
            uuid
          }
          stripeVerificationUrl
        }
      }
    `,
    result: d => d['createAgency']
  },
  createClient: {
    mutation: gql`
      mutation($agencyUuid: ID!, $name: String!, $emailAddress: String) {
        createClient(agencyUuid: $agencyUuid, name: $name, emailAddress: $emailAddress) {
          success
          message
          client {
            uuid
            name
            emailAddress
          }
        }
      }
    `,
    result: d => d['createClient'],
    after(client, result, { agencyUuid }) {
      if (!result.success) return;
      const query = queries.clients.query;
      const data = produce(client.readQuery({ query, variables: { agencyUuid } }), data => {
        data.agency.clientsConnection.edges.push(result.client);
      });
      client.writeQuery({ query, data });
    }
  },
  deleteClient: {
    mutation: gql`
      mutation($clientUuid: ID!) {
        deleteClient(clientUuid: $clientUuid) {
          success
          message
          uuid
        }
      }
    `,
    result: d => d['createAgency']
  },
  editImage: {
    mutation: gql`
      mutation($agencyUuid: ID!, $imageName: String!, $imageData: String!, $imageColor: String!) {
        editImage(agencyUuid: $agencyUuid, imageName: $imageName, imageData: $imageData, imageColor: $imageColor) {
          success
          message
          image {
            uuid
          }
        }
      }
    `,
    result: d => d['editImage']
  },
};
