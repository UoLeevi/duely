import { useQuery as useApolloQuery } from '@apollo/client';
import { queries } from 'apollo/queries';

export default function useQuery(queryName, variables, options) {
  const { query, result, variables: defaultVariables, ...defaultOptions } = queries[queryName];
  const { data: rawData, ...rest } = useApolloQuery(query, { 
    variables: {
      ...defaultVariables,
      ...variables
    },
    ...defaultOptions,
    ...options
  });

  const data = result(rawData);
  return { data, ...rest };
}
