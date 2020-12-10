import {
  ApolloCache,
  gql,
  MutationOptions,
  NormalizedCacheObject,
  Reference,
  StoreObject,
} from '@apollo/client';
import {
  Agency,
  CreateAgencyDocument,
  CreatePriceDocument,
  CreateServiceDocument,
  DeleteServiceDocument,
  LogInDocument,
  LogOutDocument,
  Price,
  Service,
  ServiceFragmentDoc,
  StartPasswordResetDocument,
  StartSignUpDocument,
  UpdateServiceDocument,
  VerifyPasswordResetDocument,
  VerifySignUpDocument,
} from '@duely/core';
import { client } from '../apollo/client';
import {
  ResultOf,
  TypedDocumentNode,
  VariablesOf,
} from '@graphql-typed-document-node/core';
// import produce from 'immer';
// import { query } from './queries';

interface TypedMutationOptions<
  TDocumentNode extends TypedDocumentNode<unknown, unknown>
> extends MutationOptions<ResultOf<TDocumentNode>, VariablesOf<TDocumentNode>> {
  mutation: TDocumentNode;
}

interface MutationDefinition<
  TDocumentNode extends TypedDocumentNode<unknown, unknown>,
  TResult = any,
  TBoundVariables = void
> extends Omit<TypedMutationOptions<TDocumentNode>, 'variables'> {
  variables?: VariablesOf<TDocumentNode> extends TBoundVariables
    ? TBoundVariables
    : never;
  result(data: ResultOf<TDocumentNode>): TResult;
  after?(
    cache: ApolloCache<NormalizedCacheObject>,
    res: TResult,
    variables: VariablesOf<TDocumentNode>
  ): Promise<void>;
}

// just a wrapper for convenience
export async function mutate<
  TResult,
  TData,
  TBoundVariables,
  TVariables extends TBoundVariables,
  TMutationDefinition extends MutationDefinition<
    TypedDocumentNode<TData, TVariables>,
    TResult,
    TBoundVariables
  >
>(
  mutationDef: TMutationDefinition,
  variables: Omit<TVariables, keyof typeof mutationDef.variables>,
  options?: Omit<
    TypedMutationOptions<TypedDocumentNode<TData, TVariables>>,
    'mutation' | 'variables'
  >
): Promise<TResult> {
  const {
    result,
    after,
    variables: defaultVariables,
    ...defaultOptions
  } = mutationDef;
  const mergedVariables = { ...defaultVariables, ...variables };
  const { data } = await client.mutate({
    variables: mergedVariables,
    ...defaultOptions,
    ...options,
  });

  const res = result(data as TData);

  if (after) {
    await after(client.cache, res, mergedVariables);
  }

  return res;
}

export const log_in_M: MutationDefinition<typeof LogInDocument> = {
  mutation: LogInDocument,
  result: (d) => d?.log_in,
  async after(cache, result) {
    if (!result.success) return;

    if (typeof window !== 'undefined') {
      localStorage.setItem('user-jwt', result.jwt);
    }

    await client.resetStore();
  },
};

export const log_out_M: MutationDefinition<typeof LogOutDocument> = {
  mutation: LogOutDocument,
  result: (d) => d?.log_out,
  async after(cache, result) {
    if (!result.success) return;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-jwt');
    }

    await client.resetStore();
  },
};

export const verify_password_reset_M: MutationDefinition<
  typeof VerifyPasswordResetDocument
> = {
  mutation: VerifyPasswordResetDocument,
  result: (d) => d?.verify_password_reset,
};

export const verify_sign_up_M: MutationDefinition<
  typeof VerifySignUpDocument
> = {
  mutation: VerifySignUpDocument,
  result: (d) => d?.verify_sign_up,
};

export const start_password_reset_M: MutationDefinition<
  typeof StartPasswordResetDocument
> = {
  mutation: StartPasswordResetDocument,
  result: (d) => d?.start_password_reset,
};

export const start_sign_up_M: MutationDefinition<typeof StartSignUpDocument> = {
  mutation: StartSignUpDocument,
  result: (d) => d?.start_sign_up,
};

export const create_agency_M: MutationDefinition<
  typeof CreateAgencyDocument
> = {
  mutation: CreateAgencyDocument,
  result: (d) => d?.create_agency,
};

export const create_service_M: MutationDefinition<
  typeof CreateServiceDocument
> = {
  mutation: CreateServiceDocument,
  result: (d) => d?.create_service,
  async after(cache, result) {
    if (!result.success) return;

    const { service } = result;

    cache.modify({
      id: cache.identify(service.agency),
      fields: {
        services(servicesRefs: Reference[] = [], { readField }) {
          const newServiceRef = cache.writeFragment({
            data: service,
            fragment: ServiceFragmentDoc,
            fragmentName: 'service',
          });

          // Quick safety check - if the new service is already
          // present in the cache, we don't need to add it again.
          if (servicesRefs.some((ref) => readField('id', ref) === service.id)) {
            return servicesRefs;
          }

          return [...servicesRefs, newServiceRef];
        },
      },
    });
  },
};

export const update_service_M: MutationDefinition<
  typeof UpdateServiceDocument
> = {
  mutation: UpdateServiceDocument,
  result: (d) => d?.update_service,
};

export const delete_service_M: MutationDefinition<
  typeof DeleteServiceDocument
> = {
  mutation: DeleteServiceDocument,
  result: (d) => d?.delete_service,
  async after(cache, result) {
    if (!result.success) return;

    const id = cache.identify(result.service);
    cache.evict({ id });
    cache.gc();
  },
};

export const create_price_M: MutationDefinition<typeof CreatePriceDocument> = {
  mutation: CreatePriceDocument,
  result: (d) => d?.create_price,
};

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
//   result: d => d?.createClient,
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
//   result: d => d?.createAgency
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
//   result: d => d?.createService,
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
//   result: d => d?.createAgency
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
//   result: d => d?.editImage
// },
// };
