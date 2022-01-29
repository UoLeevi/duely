import { QueryFunctionOptions, useQuery as useApolloQuery } from '@apollo/client';
import { QueryDefinition } from '../queries';

export type UseQueryReturn<T> = {
  queryDef: QueryDefinition<any, any, any, T> | null;
  data: T | undefined;
  loading: boolean;
  initialLoading: boolean;
  depsLoading: boolean;
  query: UseQueryReturn<T>;
} & Pick<ReturnType<typeof useApolloQuery>, 'error'>;

export function useQuery<
  TData,
  TVariables extends TBoundVariables,
  TBoundVariables extends { [key: string]: any },
  TResult,
  TDeps extends readonly UseQueryReturn<unknown>[] = UseQueryReturn<unknown>[]
>(
  queryDef: QueryDefinition<TData, TVariables, TBoundVariables, TResult>,
  variables?:
    | Omit<TVariables, keyof typeof queryDef.variables>
    | ((
        ...deps: {
          [Index in keyof TDeps]: TDeps[Index] extends UseQueryReturn<infer T> ? T : never;
        }
      ) => Omit<TVariables, keyof typeof queryDef.variables>),
  options?: { deps?: TDeps } & QueryFunctionOptions<TData, TVariables>
): UseQueryReturn<TResult> {
  const { query, result, variables: defaultVariables, ...defaultOptions } = queryDef;
  const depsLoading = options?.deps?.some((dep) => dep.loading || !dep.data) ?? false;

  const {
    data: rawData,
    networkStatus,
    loading: initialLoading,
    previousData,
    ...rest
  } = useApolloQuery(query, {
    variables: {
      ...defaultVariables,
      ...(typeof variables === 'function'
        ? depsLoading
          ? undefined
          : variables(...(options?.deps?.map((d) => d.data)! as any))
        : variables)!
    },
    ...defaultOptions,
    ...options,
    skip: options?.skip || depsLoading || false
  });

  // https://github.com/apollographql/apollo-client/blob/main/src/core/networkStatus.ts
  const loading = depsLoading || (networkStatus ? networkStatus < 7 : initialLoading);

  const data = rawData && result(rawData);

  return {
    get query() {
      return this;
    },
    queryDef,
    data,
    loading,
    depsLoading,
    initialLoading,
    ...rest,
  };
}
