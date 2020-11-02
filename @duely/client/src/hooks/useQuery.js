import { useQuery as useApolloQuery } from '@apollo/client';

export function useQuery(queryDef, variables, options) {
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
  const loading = networkStatus
    ? networkStatus < 7
    : initialLoading;

  const data = result(rawData);
  return { data, loading, initialLoading, ...rest };
}
