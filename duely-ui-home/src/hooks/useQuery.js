import { useQuery as useApolloQuery } from '@apollo/client';
import { queries } from 'apollo/queries';

export default function useQuery(queryName, variables, options) {
  const { query, result, variables: defaultVariables, ...defaultOptions } = queries[queryName];
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
