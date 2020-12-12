import { useQuery as useApolloQuery } from '@apollo/client';
import { QueryDefinition, TypedQueryOptions } from '../queries';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export function useQuery<
  TData,
  TVariables extends TBoundVariables,
  TBoundVariables extends { [key: string]: any },
  TResult
>(
  queryDef: QueryDefinition<TData, TVariables, TBoundVariables, TResult>,
  variables?: Omit<TVariables, keyof typeof queryDef.variables>,
  options?: Omit<TypedQueryOptions<TypedDocumentNode<TData, TVariables>>, 'query' | 'variables'>
) {
  const { query, result, variables: defaultVariables, ...defaultOptions } = queryDef;
  const { data: rawData, networkStatus, loading: initialLoading, ...rest } = useApolloQuery(query, {
    variables: {
      ...defaultVariables,
      ...variables
    },
    ...defaultOptions,
    ...options
  });

  // https://github.com/apollographql/apollo-client/blob/main/src/core/networkStatus.ts
  const loading = networkStatus ? networkStatus < 7 : initialLoading;

  const data = rawData && result(rawData);
  return { data, loading, initialLoading, ...rest };
}
