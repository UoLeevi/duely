import {
  CountriesDocument,
  CountryCode,
  CountryUtil,
  CurrentUserDocument,
  ServicesAgreementDocument,
  AgencyStripeAccountUpdateUrlDocument,
  AgencyStripeAccountBalanceDocument,
  AgencyStripeAccountBalanceTransactionsDocument,
  AgencyStripeAccountPaymentIntentsDocument,
  AgencyStripeAccountCustomersDocument,
  CurrentUserAgenciesDocument,
  SubdomainPublicDocument,
  AgencyServicesDocument,
  ServiceDocument,
  SubdomainAgencyDocument,
  SubdomainAgencyStripeAccountUpdateUrlDocument
} from '@duely/core';
import { QueryOptions } from '@apollo/client';
import { client } from '../apollo/client';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';

export interface TypedQueryOptions<TDocumentNode extends TypedDocumentNode<unknown, unknown>>
  extends QueryOptions<VariablesOf<TDocumentNode>, ResultOf<TDocumentNode>> {
  readonly query: TDocumentNode;
}

export interface QueryDefinition<
  TData,
  TVariables extends TBoundVariables,
  TBoundVariables extends { [key: string]: any },
  TResult
> extends Omit<TypedQueryOptions<TypedDocumentNode<TData, TVariables>>, 'variables'> {
  readonly variables?: TBoundVariables;
  readonly result: (data: TData) => TResult;
}

// just a wrapper for convenience
export async function query<
  TData,
  TVariables extends TBoundVariables,
  TBoundVariables extends { [key: string]: any },
  TResult
>(
  queryDef: QueryDefinition<TData, TVariables, TBoundVariables, TResult>,
  variables?: Omit<TVariables, keyof typeof queryDef.variables>,
  options?: Omit<TypedQueryOptions<TypedDocumentNode<TData, TVariables>>, 'query' | 'variables'>
): Promise<ReturnType<typeof queryDef.result>> {
  const { result, variables: defaultVariables, ...defaultOptions } = queryDef;
  const mergedVariables = { ...defaultVariables, ...variables };
  const { data } = await client.query({
    variables: mergedVariables,
    ...defaultOptions,
    ...options
  });

  return result(data);
}

export const current_user_Q = {
  query: CurrentUserDocument,
  notifyOnNetworkStatusChange: true,
  result: (d: ResultOf<typeof CurrentUserDocument>) => d?.current_user
};

export const countries_Q = {
  query: CountriesDocument,
  result: (d: ResultOf<typeof CountriesDocument>) =>
    d?.country_codes?.map((code) => CountryUtil.fromCode(code as CountryCode))
};

export const services_agreement_Q = {
  query: ServicesAgreementDocument,
  result: (d: ResultOf<typeof ServicesAgreementDocument>) => d?.markdowns?.[0]?.data
};

export const agency_stripe_account_update_url_Q = {
  query: AgencyStripeAccountUpdateUrlDocument,
  fetchPolicy: 'no-cache',
  result: (d: ResultOf<typeof AgencyStripeAccountUpdateUrlDocument>) =>
    d?.agency?.stripe_account?.account_update_url?.url
};

export const agency_stripe_account_balance_Q = {
  query: AgencyStripeAccountBalanceDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountBalanceDocument>) =>
    d?.agency?.stripe_account?.balance
};

export const agency_stripe_account_balance_transactions_Q = {
  query: AgencyStripeAccountBalanceTransactionsDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountBalanceTransactionsDocument>) =>
    d?.agency?.stripe_account?.balance_transactions
};

export const agency_stripe_account_payment_intents_Q = {
  query: AgencyStripeAccountPaymentIntentsDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountPaymentIntentsDocument>) =>
    d?.agency?.stripe_account?.payment_intents
};

export const agency_stripe_account_customers_Q = {
  query: AgencyStripeAccountCustomersDocument,
  result: (d: ResultOf<typeof AgencyStripeAccountCustomersDocument>) =>
    d?.agency?.stripe_account?.customers
};

export const current_user_agencies_Q = {
  query: CurrentUserAgenciesDocument,
  notifyOnNetworkStatusChange: true,
  result: (d: ResultOf<typeof CurrentUserAgenciesDocument>) =>
    d?.current_user?.memberships.map((m) => ({
      ...m.subdomain.agency,
      subdomain: m.subdomain
    }))
};

export const subdomain_public_Q = {
  query: SubdomainPublicDocument,
  result: (d: ResultOf<typeof SubdomainPublicDocument>) => d?.subdomains?.[0]
};

export const current_subdomain_Q = {
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

export const agency_services_Q = {
  query: AgencyServicesDocument,
  result: (d: ResultOf<typeof AgencyServicesDocument>) => d?.agency?.services
};

export const service_Q = {
  query: ServiceDocument,
  result: (d: ResultOf<typeof ServiceDocument>) => d?.service
};

export const current_agency_Q = {
  ...current_subdomain_Q,
  query: SubdomainAgencyDocument,
  result: (d: ResultOf<typeof SubdomainAgencyDocument>) => d?.subdomains?.[0]?.agency
};

export const current_agency_stripe_account_update_url_Q = {
  ...current_subdomain_Q,
  query: SubdomainAgencyStripeAccountUpdateUrlDocument,
  fetchPolicy: 'no-cache',
  result: (d: ResultOf<typeof SubdomainAgencyStripeAccountUpdateUrlDocument>) =>
    d?.subdomains?.[0]?.agency?.stripe_account?.account_update_url?.url
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
