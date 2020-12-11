import { useQuery as useApolloQuery } from '@apollo/client';
import { QueryDefinition, TypedQueryOptions } from '../queries';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export function useQuery<
  TResult,
  TData,
  TBoundVariables,
  TVariables extends TBoundVariables,
  TQueryDefinition extends QueryDefinition<
    TypedDocumentNode<TData, TVariables>,
    TResult,
    TBoundVariables
  >
>(
  queryDef: TQueryDefinition,
  variables: TVariables,
  options: Omit<TypedQueryOptions<TypedDocumentNode<TData, TVariables>>, 'query' | 'variables'>
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
