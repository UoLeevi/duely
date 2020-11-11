import { gql } from '@apollo/client';
import { client } from '../apollo/client';

// just a wrapper for convenience
export async function query(queryDef, variables, ...options) {
  const { result, variables: defaultVariables, ...defaultOptions } = queryDef;
  variables = { ...defaultVariables, ...variables };
  const { data } = await client.query({
    variables,
    ...defaultOptions,
    ...options
  });

  return result(data);
}

export const current_user_Q = {
  query: gql`
    query {
      current_user {
        id
        name
        email_address
      }
    }
  `,
  notifyOnNetworkStatusChange: true,
  result: d => d?.current_user
};

export const country_codes_Q = {
  query: gql`
    query {
      country_codes
    }
  `,
  result: d => d?.country_codes
};

export const services_agreement_Q = {
  query: gql`
    query {
      markdowns(filter: { name: "Services Agreement", agency_id: null }) {
        id
        name
        data
      }
    }
  `,
  result: d => d?.markdowns[0].data
};

export const current_user_agencies_Q = {
  query: gql`
    query {
      current_user {
        id
        memberships {
          id
          access
          subdomain {
            id
            name
            agency {
              id
              name
              stripe_account {
                id
                id_ext
                business_profile {
                  mcc
                  name
                  product_description
                  support_address
                  support_email
                  support_phone
                  support_url
                  url
                }
                business_type
                capabilities {
                  card_payments
                  transfers
                }
                requirements {
                  current_deadline
                  disabled_reason
                  currently_due
                  eventually_due
                  past_due
                  pending_verification
                }
                settings {
                  branding {
                    icon
                    logo
                    primary_color
                    secondary_color
                  }
                }
                charges_enabled
                country
                created
                default_currency
                details_submitted
                email
                payouts_enabled
              }
            }
            memberships {
              id
              access
              user {
                id
                name
              }
            }
          }
          user {
            id
          }
        }
      }
    }
  `,
  notifyOnNetworkStatusChange: true,
  result: d => d?.current_user?.memberships
    .map(m => ({
      id: m.subdomain.agency.id,
      name: m.subdomain.agency.name,
      subdomain_name: m.subdomain.name,
      stripe_account: m.subdomain.agency.stripe_account
    }))
};

export const subdomain_public_Q = {
  query: gql`
    query($subdomain_name: String!) {
      subdomains(filter: { name: $subdomain_name }) {
        id
        name
        agency {
          id
          name
          theme {
            id
            image_logo {
              id
              data
            }
          }
        }
      }
    }
  `,
  result: d => d?.subdomains[0]
};

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
