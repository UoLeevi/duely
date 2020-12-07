import { ApolloCache, gql, MutationOptions, NormalizedCacheObject, OperationVariables, Reference, StoreObject, TypedDocumentNode } from '@apollo/client';
import { Agency, Price, Service } from '@duely/core';
import { client } from '../apollo/client';
import { price_F, service_F } from '../fragments';
// import produce from 'immer';
// import { query } from './queries';

// use type below if needed
// see: https://stackoverflow.com/a/49683575
// type Id<T> = {[K in keyof T]: T[K]};

interface MutationResult {
  success: boolean;
  message: string | null;
}

interface TypedMutationOptions<
  T = any,
  TVariables = OperationVariables
> extends MutationOptions<T, TVariables> {
  mutation: TypedDocumentNode<T, TVariables>;
}

interface MutationDefinition<
  TResult = any,
  TData = any,
  TBoundVariables = void,
  TVariables extends TBoundVariables = TBoundVariables,
> extends Omit<TypedMutationOptions<TData, TVariables>, 'variables'> {
  variables?: TVariables;
  result(data: TData): TResult & MutationResult;
  after?(cache: ApolloCache<NormalizedCacheObject>, res: TResult & MutationResult, variables: TVariables): Promise<void>;
}

// just a wrapper for convenience
export async function mutate<
  TResult = any,
  TData = any,
  TBoundVariables = void,
  TVariables extends TBoundVariables = TBoundVariables,
>(
  mutationDef: MutationDefinition<TResult, TData, TBoundVariables, TVariables>,
  variables: Omit<TVariables, keyof typeof mutationDef.variables>,
  options?: Omit<Partial<TypedMutationOptions<TData, TVariables>>, 'mutation' | 'variables'>
) {
  const { result, after, variables: defaultVariables, ...defaultOptions } = mutationDef;
  const mergedVariables = { ...defaultVariables, ...variables };
  const { data } = await client.mutate({
    variables: mergedVariables,
    ...defaultOptions,
    ...options
  });

  const res = result(data as TData);

  if (after) {
    await after(client.cache, res, mergedVariables);
  }

  return res;
}

export const log_in_M: MutationDefinition<{ jwt: string; }, { log_in: { jwt: string; } & MutationResult }, {},{ email_address: string, password: string }> = {
  mutation: gql`
    mutation log_in_M($email_address: String!, $password: String!) {
      log_in(email_address: $email_address, password: $password) {
        success
        message
        jwt
      }
    }
  `,
  result: d => d?.log_in,
  async after(cache, result) {
    if (!result.success) return;

    if (typeof window !== 'undefined') {
      localStorage.setItem('user-jwt', result.jwt);
    }

    await client.resetStore();
  }
};

export const log_out_M: MutationDefinition = {
  mutation: gql`
    mutation log_out_M {
      log_out {
        success
        message
      }
    }
  `,
  result: d => d?.log_out,
  async after(cache, result) {
    if (!result.success) return;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-jwt');
    }

    await client.resetStore();
  }
};

export const verify_password_reset_M: MutationDefinition = {
  mutation: gql`
    mutation verify_password_reset_M($verification_code: String!, $password: String!) {
      verify_password_reset(verification_code: $verification_code, password: $password) {
        success
        message
      }
    }
  `,
  result: d => d?.verify_password_reset
};

export const verify_sign_up_M: MutationDefinition = {
  mutation: gql`
    mutation verify_sign_up_M($verification_code: String!) {
      verify_sign_up(verification_code: $verification_code) {
        success
        message
      }
    }
  `,
  result: d => d?.verify_sign_up
};

export const start_password_reset_M: MutationDefinition = {
  mutation: gql`
    mutation start_password_reset_M($email_address: String!, $redirect_url: String) {
      start_password_reset(email_address: $email_address, redirect_url: $redirect_url) {
        success
        message
      }
    }
  `,
  result: d => d?.start_password_reset
};

export const start_sign_up_M: MutationDefinition = {
  mutation: gql`
    mutation start_sign_up_M($email_address: String!, $password: String!, $name: String!, $redirect_url: String) {
      start_sign_up(email_address: $email_address, password: $password, name: $name, redirect_url: $redirect_url) {
        success
        message
      }
    }
  `,
  result: d => d?.start_sign_up
};

export const create_agency_M: MutationDefinition<Agency> = {
  mutation: gql`
    mutation create_agency_M($name: String!, $subdomain_name: String!, $country_code: String!, $image_logo: ImageInput!, $return_url: String!) {
      create_agency(name: $name, subdomain_name: $subdomain_name, country_code: $country_code, image_logo: $image_logo, return_url: $return_url) {
        stripe_verification_url
        message
        success
        agency {
          id
          name
          subdomain {
            id
            name
          }
        }
      }
    }
  `,
  result: d => d?.create_agency
};

export const create_service_M: MutationDefinition<{ service: Service & { agency: StoreObject; }; }> = {
  mutation: gql`
    mutation create_service_M($agency_id: ID!, $name: String!, $description: String!, $url_name: String!, $duration: String, $image_logo: ImageInput, $image_hero: ImageInput, $status: String) {
      create_service(agency_id: $agency_id, name: $name, description: $description, url_name: $url_name, duration: $duration, image_logo: $image_logo, image_hero: $image_hero, status: $status) {
        success
        message
        service {
          ...service_F
        }
      }
    }
    ${service_F}
  `,
  result: d => d?.create_service,
  async after(cache, result) {
    if (!result.success) return;

    const { service } = result;

    cache.modify({
      id: cache.identify(service.agency),
      fields: {
        services(servicesRefs: Reference[] = [], { readField }) {
          const newServiceRef = cache.writeFragment({
            data: service,
            fragment: service_F,
            fragmentName: 'service_F'
          });

          // Quick safety check - if the new service is already
          // present in the cache, we don't need to add it again.
          if (servicesRefs.some(ref => readField('id', ref) === service.id)) {
            return servicesRefs;
          }

          return [...servicesRefs, newServiceRef];
        }
      }
    });
  }
};

export const update_service_M: MutationDefinition<{ service: Service; }> = {
  mutation: gql`
    mutation update_service_M($service_id: ID!, $name: String, $description: String, $url_name: String, $duration: String, $default_price_id: ID, $image_logo: ImageInput, $image_hero: ImageInput, $status: String) {
      update_service(service_id: $service_id, name: $name, description: $description, url_name: $url_name, duration: $duration, default_price_id: $default_price_id, image_logo: $image_logo, image_hero: $image_hero, status: $status) {
        success
        message
        service {
          ...service_F
        }
      }
    }
    ${service_F}
  `,
  result: d => d?.update_service
};

export const delete_service_M: MutationDefinition<{ service: { id: string; }; }> = {
  mutation: gql`
    mutation delete_service_M($service_id: ID!) {
      delete_service(service_id: $service_id) {
        success
        message
        service {
          id
        }
      }
    }
  `,
  result: d => d?.delete_service,
  async after(cache, result) {
    if (!result.success) return;

    const id = cache.identify(result.service);
    cache.evict({ id });
    cache.gc();
  }
};

export const create_price_M: MutationDefinition<{ price: Price; }> = {
  mutation: gql`
    mutation create_price_M($service_variant_id: ID!, $unit_amount: Int!, $currency: String!, $recurring_interval: String, $recurring_interval_count: Int, $status: String) {
      create_price(service_variant_id: $service_variant_id, unit_amount: $unit_amount, currency: $currency, recurring_interval: $recurring_interval, recurring_interval_count: $recurring_interval_count, status: $status) {
        success
        message
        price {
          ...price_F
        }
      }
    }
    ${price_F}
  `,
  result: d => d?.create_price
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
