import { Agency, Country, CountryCode, CountryUtil, Service, Subdomain, Theme, User } from '@duely/core';
import { gql, QueryOptions, TypedDocumentNode } from '@apollo/client';
import { client } from '../apollo/client';
import { stripe_account_F, theme_F, service_F, user_F, markdown_F, agency_F, membership_F, payment_intent_F, balance_transaction_F, customer_F } from '../fragments';

interface TypedQueryOptions<
  T = any,
  TVariables = void
  > extends QueryOptions<TVariables, T> {
  query: TypedDocumentNode<T, TVariables>;
}

interface QueryDefinition<
  TResult = any,
  TData = any,
  TBoundVariables = void,
  TVariables extends TBoundVariables = TBoundVariables,
  > extends Omit<TypedQueryOptions<TData, TVariables>, 'variables'> {
  variables?: TBoundVariables;
  result(data: TData): TResult;
}

// just a wrapper for convenience
export async function query<
  TResult = any,
  TData = any,
  TBoundVariables = void,
  TVariables extends TBoundVariables = TBoundVariables,
  >(
    queryDef: QueryDefinition<TResult, TData, TBoundVariables, TVariables>,
    variables: Omit<TVariables, keyof typeof queryDef.variables>,
    options?: Omit<Partial<TypedQueryOptions<TData, TVariables>>, 'query' | 'variables'>
  ): Promise<TResult> {
  const { result, variables: defaultVariables, ...defaultOptions } = queryDef;
  const mergedVariables = { ...defaultVariables, ...variables };
  const { data } = await client.query({
    variables: mergedVariables,
    ...defaultOptions,
    ...options
  });

  return result(data);
}

export const current_user_Q: QueryDefinition<User | null, { current_user: User | null; }> = {
  query: gql`
    query current_user_Q {
      current_user {
        ...user_F
        memberships {
          ...membership_F
        }
      }
    }
    ${user_F}
    ${membership_F}
  `,
  notifyOnNetworkStatusChange: true,
  result: d => d?.current_user
};

export const countries_Q: QueryDefinition<Country[], { country_codes: CountryCode[]; }> = {
  query: gql`
    query countries_Q {
      country_codes
    }
  `,
  result: d => d?.country_codes.map(code => CountryUtil.fromCode(code))
};

export const services_agreement_Q: QueryDefinition<string, { markdowns: { data: string }[] }> = {
  query: gql`
    query services_agreement_Q {
      markdowns(filter: { name: "Services Agreement", agency_id: null }) {
        ...markdown_F
      }
    }
    ${markdown_F}
  `,
  result: d => d?.markdowns[0].data
};

export const agency_stripe_account_update_url_Q: QueryDefinition<string, { agency: { stripe_account: { account_update_url: { url: string } } } }> = {
  query: gql`
    query agency_stripe_account_update_url_Q($agency_id: ID!) {
      agency(id: $agency_id ) {
        stripe_account {
          account_update_url {
            url
          }
        }
      }
    }
  `,
  fetchPolicy: 'no-cache',
  result: d => d?.agency?.stripe_account?.account_update_url?.url
};

export const agency_stripe_account_balance_Q: QueryDefinition = {
  query: gql`
    query agency_stripe_account_balance_Q($agency_id: ID!) {
      agency(id: $agency_id ) {
        stripe_account {
          id
          balance {
            available {
              amount
              currency
              source_types {
                card
                bank_account
              }
            }
            pending {
              amount
              currency
              source_types {
                card
                bank_account
              }
            }
            connect_reserved {
              amount
              currency
              source_types {
                card
                bank_account
              }
            }
          }
        }
      }
    }
  `,
  result: d => d?.agency?.stripe_account?.balance
};

export const agency_stripe_account_balance_transactions_Q: QueryDefinition = {
  query: gql`
    query agency_stripe_account_balance_transactions_Q($agency_id: ID!, $created: Date, $starting_after_id: String, $ending_before_id: String, $limit: Int) {
      agency(id: $agency_id) {
        stripe_account {
          id
          balance_transactions(created: $created, starting_after_id: $starting_after_id, ending_before_id: $ending_before_id, limit: $limit) {
            ...balance_transaction_F
          }
        }
      }
    }
    ${balance_transaction_F}
  `,
  result: d => d?.agency?.stripe_account?.balance_transactions
};

export const agency_stripe_account_payment_intents_Q: QueryDefinition = {
  query: gql`
    query agency_stripe_account_payment_intents_Q($agency_id: ID!, $created: Date, $starting_after_id: String, $ending_before_id: String, $limit: Int) {
      agency(id: $agency_id) {
        stripe_account {
          id
          payment_intents(created: $created, starting_after_id: $starting_after_id, ending_before_id: $ending_before_id, limit: $limit) {
            ...payment_intent_F
          }
        }
      }
    }
    ${payment_intent_F}
  `,
  result: d => d?.agency?.stripe_account?.payment_intents
};

export const agency_stripe_account_customers_Q: QueryDefinition = {
  query: gql`
    query agency_stripe_account_customers_Q($agency_id: ID!, $created: Date, $starting_after_id: String, $ending_before_id: String, $limit: Int) {
      agency(id: $agency_id) {
        stripe_account {
          id
          customers(created: $created, starting_after_id: $starting_after_id, ending_before_id: $ending_before_id, limit: $limit) {
            ...customer_F
          }
        }
      }
    }
    ${customer_F}
  `,
  result: d => d?.agency?.stripe_account?.customers
};

export const current_user_agencies_Q: QueryDefinition<Agency[], { current_user: { memberships: { subdomain: { agency: Agency; }; }[]; }; }> = {
  query: gql`
    query current_user_agencies_Q {
      current_user {
        id
        memberships {
          id
          access
          subdomain {
            id
            name
            agency {
              ...agency_F
              stripe_account {
                ...stripe_account_F
              }
            }
            memberships {
              ...membership_F
            }
          }
          user {
            id
          }
        }
      }
    }
    ${agency_F}
    ${stripe_account_F}
    ${membership_F}
  `,
  notifyOnNetworkStatusChange: true,
  result: d => d?.current_user?.memberships
    .map(m => ({
      ...m.subdomain.agency,
      subdomain: m.subdomain
    }))
};

export const subdomain_public_Q: QueryDefinition<Subdomain, { subdomains: (Subdomain & { agency: { theme: Theme } })[] }, { subdomain_name: string; }> = {
  query: gql`
    query subdomain_public_Q($subdomain_name: String!) {
      subdomains(filter: { name: $subdomain_name }) {
        id
        name
        agency {
          id
          name
          theme {
            ...theme_F
          }
        }
      }
    }
    ${theme_F}
  `,
  result: d => d?.subdomains[0]
};

export const current_subdomain_Q: QueryDefinition<Subdomain, { subdomains: (Subdomain & { agency: { theme: Theme } })[] }, { subdomain_name: string | null; }> = {
  ...subdomain_public_Q,
  variables: {
    subdomain_name: resolveSubdomain()
  }
};

function resolveSubdomain(): string | null {
  const domain = window.location.hostname.toLowerCase();
  let subdomain = null;

  if (process.env.NODE_ENV === 'production') {
    if (domain !== 'duely.app') {
      if (domain.endsWith('.duely.app')) {
        subdomain = domain.slice(0, -'.duely.app'.length);
      } else {
        // TODO: check from database
        throw new Error('Not implemented.');
      }
    }
  } else {
    const url = new URL(window.location.href);
    let name = url.searchParams.get('subdomain');
    subdomain = name?.toLowerCase() ?? 'test';
  }

  return subdomain;
}

export const agency_services_Q: QueryDefinition<Service[], { agency: { services: Service[] } }, {}, { agency_id: string; }> = {
  query: gql`
    query agency_services_Q($agency_id: ID!) {
      agency(id: $agency_id) {
        id
        services {
          ...service_F
        }
      }
    }
    ${service_F}
  `,
  result: d => d?.agency?.services
};

export const service_Q: QueryDefinition<Service, { service: Service }, {}, { service_id: string; }> = {
  query: gql`
    query service_Q($service_id: ID!) {
      service(id: $service_id) {
        ...service_F
      }
    }
    ${service_F}
  `,
  result: d => d?.service
};

export const current_agency_Q: QueryDefinition<Agency, { subdomains: { agency: Agency }[] }, {}, { subdomain_name: string; }> = {
  ...current_subdomain_Q,
  query: gql`
    query current_agency_Q($subdomain_name: String!) {
      subdomains(filter: { name: $subdomain_name }) {
        id
        name
        agency {
          ...agency_F
          services {
            ...service_F
          }
        }
      }
    }
    ${agency_F}
    ${service_F}
  `,
  result: d => d?.subdomains[0]?.agency
};

export const current_agency_stripe_account_update_url_Q: QueryDefinition<string, { subdomains: { agency: { stripe_account: { account_update_url: { url: string } } } }[] }, {}, { subdomain_name: string; }> = {
  ...current_subdomain_Q,
  query: gql`
    query current_agency_stripe_account_update_url_Q($subdomain_name: String!) {
      subdomains(filter: { name: $subdomain_name }) {
        id
        name
        agency {
          stripe_account {
            account_update_url {
              url
            }
          }
        }
      }
    }
  `,
  fetchPolicy: 'no-cache',
  result: d => d?.subdomains[0]?.agency?.stripe_account?.account_update_url?.url
};;

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
