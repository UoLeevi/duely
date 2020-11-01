import { gql } from '@apollo/client';
import { client } from './client';
// import produce from 'immer';
// import { query } from './queries';

export const mutations = {
  log_in: {
    mutation: gql`
      mutation($email_address: String!, $password: String!) {
        log_in(email_address: $email_address, password: $password) {
          success
          message
          jwt
        }
      }
    `, 
    result: d => d['log_in'],
    async after(cache, result) {
      if (!result.success) return;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user-jwt', result.jwt);
      }

      await client.resetStore();
    }
  },
  log_out: {
    mutation: gql`
      mutation {
        log_out {
          success
          message
        }
      }
    `, 
    result: d => d['log_out'],
    async after(cache, result) {
      if (!result.success) return;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user-jwt');
      }

      await client.resetStore();
    }
  },
  verify_password_reset: {
    mutation: gql`
      mutation($verification_code: String!, $password: String!) {
        verify_password_reset(verification_code: $verification_code, password: $password) {
          success
          message
        }
      }
    `, 
    result: d => d['verify_password_reset']
  },
  verify_sign_up: {
    mutation: gql`
      mutation($verification_code: String!) {
        verify_sign_up(verification_code: $verification_code) {
          success
          message
        }
      }
    `, 
    result: d => d['verify_sign_up']
  },
  start_password_reset: {
    mutation: gql`
      mutation($email_address: String!, $redirect_url: String) {
        start_password_reset(email_address: $email_address, redirect_url: $redirect_url) {
          success
          message
        }
      }
    `,
    result: d => d['start_password_reset']
  },
  start_sign_up: {
    mutation: gql`
      mutation($email_address: String!, $password: String!, $name: String!, $redirect_url: String) {
        start_sign_up(email_address: $email_address, password: $password, name: $name, redirect_url: $redirect_url) {
          success
          message
        }
      }
    `,
    result: d => d['start_sign_up']
  },
  // createAgency: {
  //   mutation: gql`
  //     mutation($name: String!, $subdomain: String!, $countryCode: String!, $returnUrl: String!) {
  //       createAgency(name: $name, subdomain: $subdomain, countryCode: $countryCode, returnUrl: $returnUrl) {
  //         success
  //         message
  //         agency {
  //           uuid
  //         }
  //         stripeVerificationUrl
  //       }
  //     }
  //   `,
  //   result: d => d['createAgency']
  // },
  // createClient: {
  //   mutation: gql`
  //     mutation($agencyUuid: ID!, $name: String!, $emailAddress: String) {
  //       createClient(agencyUuid: $agencyUuid, name: $name, emailAddress: $emailAddress) {
  //         success
  //         message
  //         client {
  //           uuid
  //           name
  //           emailAddress
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d['createClient'],
  //   after(client, result, { agencyUuid }) {
  //     if (!result.success) return;
  //     const query = queries.clients.query;
  //     const data = produce(client.readQuery({ query, variables: { agencyUuid } }), data => {
  //       data.agency.clientsConnection.edges.push(result.client);
  //     });
  //     client.writeQuery({ query, data });
  //   }
  // },
  // deleteClient: {
  //   mutation: gql`
  //     mutation($clientUuid: ID!) {
  //       deleteClient(clientUuid: $clientUuid) {
  //         success
  //         message
  //         uuid
  //       }
  //     }
  //   `,
  //   result: d => d['createAgency']
  // },
  // createService: {
  //   mutation: gql`
  //     mutation($agencyUuid: ID!, $name: String!) {
  //       createService(agencyUuid: $agencyUuid, name: $name) {
  //         success
  //         message
  //         service {
  //           uuid
  //           name
  //           status
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d['createService'],
  //   after(client, result, { agencyUuid }) {
  //     if (!result.success) return;
  //     const query = queries.services.query;
  //     const data = produce(client.readQuery({ query, variables: { agencyUuid } }), data => {
  //       data.agency.servicesConnection.edges.push(result.service);
  //     });
  //     client.writeQuery({ query, data });
  //   }
  // },
  // deleteService: {
  //   mutation: gql`
  //     mutation($serviceUuid: ID!) {
  //       deleteService(serviceUuid: $serviceUuid) {
  //         success
  //         message
  //         uuid
  //       }
  //     }
  //   `,
  //   result: d => d['createAgency']
  // },
  // editImage: {
  //   mutation: gql`
  //     mutation($agencyUuid: ID!, $imageName: String!, $imageData: String!, $imageColor: String!) {
  //       editImage(agencyUuid: $agencyUuid, imageName: $imageName, imageData: $imageData, imageColor: $imageColor) {
  //         success
  //         message
  //         image {
  //           uuid
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d['editImage']
  // },
};

// just a wrapper for convenience
export async function mutate(mutationName, variables, ...options) {
  const { result, after, variables: defaultVariables, ...defaultOptions } = mutations[mutationName];
  variables = { ...defaultVariables, ...variables };
  const { data } = await client.mutate({
    variables,
    ...defaultOptions,
    ...options
  });

  const res = result(data);

  if (after) {
    await after(client.cache, res, variables);
  }

  return res;
}
