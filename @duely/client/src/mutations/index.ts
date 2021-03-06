import { ApolloCache, MutationOptions, NormalizedCacheObject, Reference } from '@apollo/client';
import {
  CreateAgencyDocument,
  CreateBankAccountDocument,
  CreateCredentialDocument,
  CreateCustomerDocument,
  CreateIntegrationConfigDocument,
  CreateIntegrationDocument,
  CreatePageBlockDocument,
  CreatePriceDocument,
  CreateProductDocument,
  CustomerFragmentDoc,
  DeleteBankAccountDocument,
  DeleteCustomerDocument,
  DeletePageBlockDocument,
  DeleteProductDocument,
  LogInDocument,
  LogOutDocument,
  Page_BlockFragmentDoc,
  ProductFragmentDoc,
  StartPasswordResetDocument,
  StartSignUpDocument,
  UpdateAgencyDocument,
  UpdateAgencySettingsDocument,
  UpdateBankAccountDocument,
  UpdateCredentialDocument,
  UpdateCustomerDocument,
  UpdateIntegrationConfigDocument,
  UpdateIntegrationDocument,
  UpdatePageBlockDocument,
  UpdatePageDocument,
  UpdateProductDocument,
  UpdateProductSettingsDocument,
  VerifyPasswordResetDocument,
  VerifySignUpDocument
} from '@duely/core';
import { client } from '../apollo/client';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';
import {
  agency_stripe_account_bank_accounts_Q,
  count_customers_Q,
  count_products_Q,
  customers_Q,
  products_Q
} from '../queries';
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
  readonly after?:
    | ((
        cache: ApolloCache<NormalizedCacheObject>,
        res: TResult | null,
        variables: TVariables
      ) => Promise<void>)
    | ((cache: ApolloCache<NormalizedCacheObject>, res: TResult | null) => Promise<void>)
    | ((cache: ApolloCache<NormalizedCacheObject>) => Promise<void>)
    | (() => Promise<void>);
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
    await after(client.cache, res ?? null, mergedVariables);
  }

  return res;
}

function evictQuery(cache: ApolloCache<NormalizedCacheObject>, query: TypedDocumentNode) {
  query.definitions.forEach((definition) => {
    if (definition.kind === 'OperationDefinition') {
      definition.selectionSet.selections.forEach((selection) => {
        if (selection.kind === 'Field') {
          cache.evict({ id: 'ROOT_QUERY', fieldName: selection.name.value });
        }
      });
    }
  });
}

const log_in_R = (d: ResultOf<typeof LogInDocument>) => d?.log_in;
export const log_in_M = {
  mutation: LogInDocument,
  result: log_in_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof log_in_R> | null
  ) {
    if (!result?.success || !result.jwt) return;

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
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof log_out_R> | null
  ) {
    if (!result?.success) return;

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

export const update_agency_M = {
  mutation: UpdateAgencyDocument,
  result: (d: ResultOf<typeof UpdateAgencyDocument>) => d?.update_agency
};

const create_bank_account_R = (d: ResultOf<typeof CreateBankAccountDocument>) =>
  d?.create_bank_account;
export const create_bank_account_M = {
  mutation: CreateBankAccountDocument,
  result: create_bank_account_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof create_bank_account_R> | null
  ) {
    if (!result?.success || !result.bank_account) return;

    evictQuery(cache, agency_stripe_account_bank_accounts_Q.query);

    cache.gc();
  }
};

export const update_bank_account_M = {
  mutation: UpdateBankAccountDocument,
  result: (d: ResultOf<typeof UpdateBankAccountDocument>) => d?.update_bank_account
};

const delete_bank_account_R = (d: ResultOf<typeof DeleteBankAccountDocument>) =>
  d?.delete_bank_account;
export const delete_bank_account_M = {
  mutation: DeleteBankAccountDocument,
  result: delete_bank_account_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof delete_bank_account_R> | null
  ) {
    if (!result?.success || !result.bank_account) return;

    const id = cache.identify(result.bank_account);
    cache.evict({ id });

    evictQuery(cache, agency_stripe_account_bank_accounts_Q.query);

    cache.gc();
  }
};

const create_product_R = (d: ResultOf<typeof CreateProductDocument>) => d?.create_product;
export const create_product_M = {
  mutation: CreateProductDocument,
  result: create_product_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof create_product_R> | null
  ) {
    if (!result?.success || !result.product) return;

    const { product } = result;

    cache.modify({
      id: cache.identify(product.agency),
      fields: {
        products(productsRefs: Reference[] = [], { readField }) {
          const newProductRef = cache.writeFragment({
            data: product,
            fragment: ProductFragmentDoc,
            fragmentName: 'product'
          });

          // Quick safety check - if the new product is already
          // present in the cache, we don't need to add it again.
          if (productsRefs.some((ref) => readField('id', ref) === product.id)) {
            return productsRefs;
          }

          return [...productsRefs, newProductRef];
        }
      }
    });

    evictQuery(cache, products_Q.query);
    evictQuery(cache, count_products_Q.query);

    cache.gc();
  }
};

export const update_product_M = {
  mutation: UpdateProductDocument,
  result: (d: ResultOf<typeof UpdateProductDocument>) => d?.update_product
};

const delete_product_R = (d: ResultOf<typeof DeleteProductDocument>) => d?.delete_product;
export const delete_product_M = {
  mutation: DeleteProductDocument,
  result: delete_product_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof delete_product_R> | null
  ) {
    if (!result?.success || !result.product) return;

    const id = cache.identify(result.product);
    cache.evict({ id });

    evictQuery(cache, products_Q.query);
    evictQuery(cache, count_products_Q.query);

    cache.gc();
  }
};

const create_customer_R = (d: ResultOf<typeof CreateCustomerDocument>) => d?.create_customer;
export const create_customer_M = {
  mutation: CreateCustomerDocument,
  result: create_customer_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof create_customer_R> | null
  ) {
    if (!result?.success || !result.customer) return;

    const { customer } = result;

    cache.modify({
      id: cache.identify(customer.stripe_account),
      fields: {
        customers(customersRefs: Reference[] = [], { readField }) {
          const newCustomerRef = cache.writeFragment({
            data: customer,
            fragment: CustomerFragmentDoc,
            fragmentName: 'customer'
          });

          // Quick safety check - if the new customer is already
          // present in the cache, we don't need to add it again.
          if (customersRefs.some((ref) => readField('id', ref) === customer.id)) {
            return customersRefs;
          }

          return [...customersRefs, newCustomerRef];
        }
      }
    });

    evictQuery(cache, customers_Q.query);
    evictQuery(cache, count_customers_Q.query);

    cache.gc();
  }
};

export const update_customer_M = {
  mutation: UpdateCustomerDocument,
  result: (d: ResultOf<typeof UpdateCustomerDocument>) => d?.update_customer
};

const delete_customer_R = (d: ResultOf<typeof DeleteCustomerDocument>) => d?.delete_customer;
export const delete_customer_M = {
  mutation: DeleteCustomerDocument,
  result: delete_customer_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof delete_customer_R> | null
  ) {
    if (!result?.success || !result.customer) return;

    const id = cache.identify(result.customer);
    cache.evict({ id });

    evictQuery(cache, customers_Q.query);
    evictQuery(cache, count_customers_Q.query);

    cache.gc();
  }
};

export const create_price_M = {
  mutation: CreatePriceDocument,
  result: (d: ResultOf<typeof CreatePriceDocument>) => d?.create_price
};

const update_agency_settings_R = (d: ResultOf<typeof UpdateAgencySettingsDocument>) =>
  d?.update_agency_settings;
export const update_agency_settings_M = {
  mutation: UpdateAgencySettingsDocument,
  result: update_agency_settings_R
};

export const update_product_settings_M = {
  mutation: UpdateProductSettingsDocument,
  result: (d: ResultOf<typeof UpdateProductSettingsDocument>) => d?.update_product_settings
};

export const update_page_M = {
  mutation: UpdatePageDocument,
  result: (d: ResultOf<typeof UpdatePageDocument>) => d?.update_page
};

const create_page_block_R = (d: ResultOf<typeof CreatePageBlockDocument>) => d?.create_page_block;
export const create_page_block_M = {
  mutation: CreatePageBlockDocument,
  result: create_page_block_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof create_page_block_R> | null
  ) {
    if (!result?.success || !result.page_block) return;

    const { page_block } = result;

    cache.modify({
      id: cache.identify(page_block.page),
      fields: {
        blocks(blocksRefs: Reference[] = [], { readField }) {
          const newPageBlockRef = cache.writeFragment({
            data: page_block,
            fragment: Page_BlockFragmentDoc,
            fragmentName: 'page_block'
          });

          // Quick safety check - if the new page_block is already
          // present in the cache, we don't need to add it again.
          if (blocksRefs.some((ref) => readField('id', ref) === page_block.id)) {
            return blocksRefs;
          }

          return [...blocksRefs, newPageBlockRef];
        }
      }
    });
  }
};

export const update_page_block_M = {
  mutation: UpdatePageBlockDocument,
  result: (d: ResultOf<typeof UpdatePageBlockDocument>) => d?.update_page_block
};

const delete_page_block_R = (d: ResultOf<typeof DeletePageBlockDocument>) => d?.delete_page_block;
export const delete_page_block_M = {
  mutation: DeletePageBlockDocument,
  result: delete_page_block_R,
  async after(
    cache: ApolloCache<NormalizedCacheObject>,
    result: ReturnType<typeof delete_page_block_R> | null
  ) {
    if (!result?.success || !result.page_block) return;

    const id = cache.identify(result.page_block);
    cache.evict({ id });
    cache.gc();
  }
};

export const create_credential_M = {
  mutation: CreateCredentialDocument,
  result: (d: ResultOf<typeof CreateCredentialDocument>) => d?.create_credential
};

export const update_credential_M = {
  mutation: UpdateCredentialDocument,
  result: (d: ResultOf<typeof UpdateCredentialDocument>) => d?.update_credential
};

export const create_integration_M = {
  mutation: CreateIntegrationDocument,
  result: (d: ResultOf<typeof CreateIntegrationDocument>) => d?.create_integration
};

export const update_integration_M = {
  mutation: UpdateIntegrationDocument,
  result: (d: ResultOf<typeof UpdateIntegrationDocument>) => d?.update_integration
};

export const create_integration_config_M = {
  mutation: CreateIntegrationConfigDocument,
  result: (d: ResultOf<typeof CreateIntegrationConfigDocument>) => d?.create_integration_config
};

export const update_integration_config_M = {
  mutation: UpdateIntegrationConfigDocument,
  result: (d: ResultOf<typeof UpdateIntegrationConfigDocument>) => d?.update_integration_config
};
