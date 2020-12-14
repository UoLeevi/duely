import { ApolloCache, MutationOptions, NormalizedCacheObject, Reference } from '@apollo/client';
import {
  CreateAgencyDocument,
  CreateAgencyThankYouPageSettingDocument,
  CreatePriceDocument,
  CreateServiceDocument,
  CreateServiceThankYouPageSettingDocument,
  DeleteAgencyThankYouPageSettingDocument,
  DeleteServiceDocument,
  DeleteServiceThankYouPageSettingDocument,
  LogInDocument,
  LogOutDocument,
  ServiceFragmentDoc,
  StartPasswordResetDocument,
  StartSignUpDocument,
  UpdateAgencyThankYouPageSettingDocument,
  UpdateServiceDocument,
  UpdateServiceThankYouPageSettingDocument,
  VerifyPasswordResetDocument,
  VerifySignUpDocument
} from '@duely/core';
import { client } from '../apollo/client';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';
// import produce from 'immer';
// import { query } from './queries';

export interface TypedMutationOptions<TDocumentNode extends TypedDocumentNode<unknown, unknown>>
  extends MutationOptions<ResultOf<TDocumentNode>, VariablesOf<TDocumentNode>> {
  mutation: TDocumentNode;
}

export interface MutationDefinition<
  TData,
  TVariables extends TBoundVariables,
  TBoundVariables extends { [key: string]: any },
  TResult
> extends Omit<TypedMutationOptions<TypedDocumentNode<TData, TVariables>>, 'variables'> {
  readonly variables?: TBoundVariables;
  readonly result: (data: TData) => TResult;
  readonly after?: (
    cache?: ApolloCache<NormalizedCacheObject>,
    res?: TResult | null | undefined,
    variables?: TVariables
  ) => Promise<void>;
}

// just a wrapper for convenience
export async function mutate<
  TData,
  TVariables extends TBoundVariables,
  TBoundVariables extends { [key: string]: any },
  TResult
>(
  mutationDef: MutationDefinition<TData, TVariables, TBoundVariables, TResult>,
  variables: Omit<TVariables, keyof typeof mutationDef.variables>,
  options?: Omit<
    TypedMutationOptions<TypedDocumentNode<TData, TVariables>>,
    'mutation' | 'variables'
  >
): Promise<ReturnType<typeof mutationDef.result> | null | undefined> {
  const { result, after, variables: defaultVariables, ...defaultOptions } = mutationDef;
  const mergedVariables = { ...defaultVariables, ...variables };
  const { data } = await client.mutate({
    variables: mergedVariables,
    ...defaultOptions,
    ...options
  });

  const res = data && result(data);

  if (after) {
    await after(client.cache, res, mergedVariables);
  }

  return res;
}

const log_in_R = (d: ResultOf<typeof LogInDocument>) => d?.log_in;
export const log_in_M = {
  mutation: LogInDocument,
  result: log_in_R,
  async after(cache: ApolloCache<NormalizedCacheObject>, result: ReturnType<typeof log_in_R>) {
    if (!result.success || !result.jwt) return;

    if (typeof window !== 'undefined') {
      localStorage.setItem('user-jwt', result.jwt);
    }

    await client.resetStore();
  }
};

const log_out_R = (d: ResultOf<typeof LogOutDocument>) => d?.log_out;
export const log_out_M = {
  mutation: LogOutDocument,
  result: log_out_R,
  async after(cache: ApolloCache<NormalizedCacheObject>, result: ReturnType<typeof log_out_R>) {
    if (!result.success) return;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-jwt');
    }

    await client.resetStore();
  }
};

export const verify_password_reset_M = {
  mutation: VerifyPasswordResetDocument,
  result: (d: ResultOf<typeof VerifyPasswordResetDocument>) => d?.verify_password_reset
};

export const verify_sign_up_M = {
  mutation: VerifySignUpDocument,
  result: (d: ResultOf<typeof VerifySignUpDocument>) => d?.verify_sign_up
};

export const start_password_reset_M = {
  mutation: StartPasswordResetDocument,
  result: (d: ResultOf<typeof StartPasswordResetDocument>) => d?.start_password_reset
};

export const start_sign_up_M = {
  mutation: StartSignUpDocument,
  result: (d: ResultOf<typeof StartSignUpDocument>) => d?.start_sign_up
};

export const create_agency_M = {
  mutation: CreateAgencyDocument,
  result: (d: ResultOf<typeof CreateAgencyDocument>) => d?.create_agency
};

const create_service_R = (d: ResultOf<typeof CreateServiceDocument>) => d?.create_service;
export const create_service_M = {
  mutation: CreateServiceDocument,
  result: create_service_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof create_service_R>
  ) {
    if (!result.success || !result.service) return;

    const { service } = result;

    cache.modify({
      id: cache.identify(service.agency),
      fields: {
        services(servicesRefs: Reference[] = [], { readField }) {
          const newServiceRef = cache.writeFragment({
            data: service,
            fragment: ServiceFragmentDoc,
            fragmentName: 'service'
          });

          // Quick safety check - if the new service is already
          // present in the cache, we don't need to add it again.
          if (servicesRefs.some((ref) => readField('id', ref) === service.id)) {
            return servicesRefs;
          }

          return [...servicesRefs, newServiceRef];
        }
      }
    });
  }
};

export const update_service_M = {
  mutation: UpdateServiceDocument,
  result: (d: ResultOf<typeof UpdateServiceDocument>) => d?.update_service
};

const delete_service_R = (d: ResultOf<typeof DeleteServiceDocument>) => d?.delete_service;
export const delete_service_M = {
  mutation: DeleteServiceDocument,
  result: delete_service_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof delete_service_R>
  ) {
    if (!result.success || !result.service) return;

    const id = cache.identify(result.service);
    cache.evict({ id });
    cache.gc();
  }
};

export const create_price_M = {
  mutation: CreatePriceDocument,
  result: (d: ResultOf<typeof CreatePriceDocument>) => d?.create_price
};

export const create_agency_thank_you_page_setting_M = {
  mutation: CreateAgencyThankYouPageSettingDocument,
  result: (d: ResultOf<typeof CreateAgencyThankYouPageSettingDocument>) =>
    d?.create_agency_thank_you_page_setting
};

export const create_service_thank_you_page_setting_M = {
  mutation: CreateServiceThankYouPageSettingDocument,
  result: (d: ResultOf<typeof CreateServiceThankYouPageSettingDocument>) =>
    d?.create_service_thank_you_page_setting
};

export const update_agency_thank_you_page_setting_M = {
  mutation: UpdateAgencyThankYouPageSettingDocument,
  result: (d: ResultOf<typeof UpdateAgencyThankYouPageSettingDocument>) =>
    d?.update_agency_thank_you_page_setting
};

export const update_service_thank_you_page_setting_M = {
  mutation: UpdateServiceThankYouPageSettingDocument,
  result: (d: ResultOf<typeof UpdateServiceThankYouPageSettingDocument>) =>
    d?.update_service_thank_you_page_setting
};

export const delete_agency_thank_you_page_setting_M = {
  mutation: DeleteAgencyThankYouPageSettingDocument,
  result: (d: ResultOf<typeof DeleteAgencyThankYouPageSettingDocument>) =>
    d?.delete_agency_thank_you_page_setting
};

export const delete_service_thank_you_page_setting_M = {
  mutation: DeleteServiceThankYouPageSettingDocument,
  result: (d: ResultOf<typeof DeleteServiceThankYouPageSettingDocument>) =>
    d?.delete_service_thank_you_page_setting
};