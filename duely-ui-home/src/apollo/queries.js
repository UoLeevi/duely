import { gql } from '@apollo/client';
import { client } from './client';

export const queries = {
  current_user: {
    query: gql`
      query {
        current_user {
          id
          name
          email_address
        }
      }
    `,
    result: d => d?.current_user
  },
  country_codes: {
    query: gql`
      query {
        country_codes
      }
    `,
    result: d => d?.country_codes
  },
  // agencies: {
  //   query: gql`
  //     query {
  //       me {
  //         uuid
  //         agenciesConnection {
  //           edges {
  //             cursor
  //             roles
  //             node {
  //               uuid
  //               name
  //               subdomain {
  //                 uuid
  //                 name
  //               }
  //               theme {
  //                 uuid
  //                 name
  //                 imageLogo {
  //                   uuid
  //                   name
  //                   color
  //                   data
  //                 }
  //                 imageHero {
  //                   uuid
  //                   name
  //                   color
  //                   data
  //                 }
  //                 colorPrimary
  //                 colorSecondary
  //                 colorAccent
  //                 colorBackground
  //                 colorSurface
  //                 colorError
  //                 colorSuccess
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d?.me.agenciesConnection.edges
  //     .map(edge => ({ ...edge.node, roles: edge.roles }))
  // },
  // invites: {
  //   query: gql`
  //     query {
  //       me {
  //         uuid
  //         invitesConnection {
  //           edges {
  //             node {
  //               uuid
  //               status
  //               agency {
  //                 uuid
  //                 name
  //                 subdomain {
  //                   uuid
  //                   name
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d?.me.invitesConnection.edges
  //     .map(edge => edge.node)
  //     .filter(invite => invite.status === null)
  // },
  // profile: {
  //   query: gql`
  //     query {
  //       me {
  //         uuid
  //         name
  //         agenciesConnection {
  //           edges {
  //             cursor
  //             roles
  //             node {
  //               uuid
  //               name
  //               subdomain {
  //                 uuid
  //                 name
  //               }
  //               theme {
  //                 uuid
  //                 name
  //                 imageLogo {
  //                   uuid
  //                   name
  //                   color
  //                   data
  //                 }
  //                 imageHero {
  //                   uuid
  //                   name
  //                   color
  //                   data
  //                 }
  //                 colorPrimary
  //                 colorSecondary
  //                 colorAccent
  //                 colorBackground
  //                 colorSurface
  //                 colorError
  //                 colorSuccess
  //               }
  //             }
  //           }
  //         }
  //         invitesConnection {
  //           edges {
  //             node {
  //               uuid
  //               status
  //               agency {
  //                 uuid
  //                 name
  //                 subdomain {
  //                   uuid
  //                   name
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d?.me
  // },
  // portal: {
  //   query: gql`
  //     query($subdomainName: String) {
  //       agency(subdomainName: $subdomainName) {
  //         uuid
  //         name
  //         theme {
  //           uuid
  //           name
  //           imageLogo {
  //             uuid
  //             name
  //             data
  //             color
  //           }
  //           imageHero {
  //             uuid
  //             name
  //             data
  //             color
  //           }
  //           colorPrimary
  //           colorSecondary
  //           colorAccent
  //           colorBackground
  //           colorSurface
  //           colorError
  //           colorSuccess
  //         }
  //         servicesConnection {
  //           edges(status: "live") {
  //             cursor
  //             node {
  //               uuid
  //               name
  //               status
  //               steps {
  //                 uuid
  //                 name
  //                 type
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d?.agency
  // },
  // dashboard: {
  //   query: gql`
  //     query($subdomainName: String) {
  //       agency(subdomainName: $subdomainName) {
  //         uuid
  //         name
  //         theme {
  //           uuid
  //           name
  //           imageLogo {
  //             uuid
  //             name
  //             data
  //             color
  //           }
  //           imageHero {
  //             uuid
  //             name
  //             data
  //             color
  //           }
  //           colorPrimary
  //           colorSecondary
  //           colorAccent
  //           colorBackground
  //           colorSurface
  //           colorError
  //           colorSuccess
  //         }
  //         servicesConnection {
  //           edges {
  //             cursor
  //             node {
  //               uuid
  //               name
  //               status
  //               steps {
  //                 uuid
  //                 name
  //                 type
  //               }
  //             }
  //           }
  //         }
  //         subjectsConnection {
  //           edges {
  //             cursor
  //             roles
  //             node {
  //               uuid
  //               name
  //               emailAddress
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d?.agency
  // },
  // agency: {
  //   query: gql`
  //     query($subdomainName: String) {
  //       agency(subdomainName: $subdomainName) {
  //         uuid
  //         name
  //         theme {
  //           uuid
  //           name
  //           imageLogo {
  //             uuid
  //             name
  //             data
  //             color
  //           }
  //           imageHero {
  //             uuid
  //             name
  //             data
  //             color
  //           }
  //           colorPrimary
  //           colorSecondary
  //           colorAccent
  //           colorBackground
  //           colorSurface
  //           colorError
  //           colorSuccess
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d?.agency
  // },
  // agencyRoles: {
  //   query: gql`
  //     query($agencyUuids: [ID!]) {
  //       me {
  //         uuid
  //         name
  //         type
  //         agenciesConnection {
  //           edges(uuids: $agencyUuids) {
  //             node {
  //               uuid
  //             }
  //             roles
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d?.me.agenciesConnection
  // },
  // clients: {
  //   query: gql`
  //     query($agencyUuid: ID!) {
  //       agency(uuid: $agencyUuid) {
  //         uuid
  //         name
  //         clientsConnection {
  //           edges {
  //             cursor
  //             node {
  //               uuid
  //               name
  //               emailAddress
  //               subject {
  //                 uuid
  //                 name
  //                 emailAddress
  //               }
  //               invite {
  //                 uuid
  //                 status
  //                 inviteeEmailAddress
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d?.agency.clientsConnection.edges
  //     .map(edge => edge.node)
  // },
  // services: {
  //   query: gql`
  //     query($agencyUuid: ID!) {
  //       agency(uuid: $agencyUuid) {
  //         uuid
  //         name
  //         servicesConnection {
  //           edges {
  //             cursor
  //             node {
  //               uuid
  //               name
  //               status
  //               steps {
  //                 uuid
  //                 name
  //                 type
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   result: d => d?.agency.servicesConnection.edges
  //     .map(edge => edge.node)
  // }
};

// just a wrapper for convenience
export async function query(queryName, variables, ...options) {
  const { result, variables: defaultVariables, ...defaultOptions } = queries[queryName];
  variables = { ...defaultVariables, ...variables };
  const { data } = await client.query({
    variables,
    ...defaultOptions,
    ...options
  });

  return result(data);
}
