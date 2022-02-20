import { QueryFunctionOptions, useQuery as useApolloQuery } from '@apollo/client';
import { useRef, useState } from 'react';
import { client } from '../apollo';
import { QueryDefinition } from '../queries';

export type UseQueryReturn<T> = {
  queryDef: QueryDefinition<any, any, any, T> | null;
  data: T | undefined | null;
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
  TDeps extends readonly UseQueryReturn<any>[] = UseQueryReturn<any>[]
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
  const { query, result, after, variables: defaultVariables, ...defaultOptions } = queryDef;
  const depsLoading = options?.deps?.some((dep) => dep.loading || !dep.data) ?? false;

  const _variables = {
    ...defaultVariables,
    ...(typeof variables === 'function'
      ? depsLoading
        ? undefined
        : variables(...(options?.deps?.map((d) => d.data)! as any))
      : variables)!
  };

  const skip = options?.skip || depsLoading || false;

  // Let's use counter to help track loading state when after function is specified
  const [afterCount, setAfterCount] = useState(0);
  const afterRef = useRef<{ promise: Promise<void> | null; count: number }>({
    promise: null,
    count: afterCount
  });

  const {
    data: rawData,
    networkStatus,
    loading: initialLoading,
    previousData,
    ...rest
  } = useApolloQuery(query, {
    variables: _variables,
    ...defaultOptions,
    ...options,
    skip
  });

  // https://github.com/apollographql/apollo-client/blob/main/src/core/networkStatus.ts
  let loading = depsLoading || (networkStatus ? networkStatus < 7 : initialLoading);
  const data = rawData && result(rawData);

  if (after) {
    if (loading && afterCount === afterRef.current.count) {
      // new query started
      ++afterRef.current.count;
    } else if (
      !loading &&
      afterCount !== afterRef.current.count &&
      afterRef.current.promise === null
    ) {
      // query completed
      const promise = after(client.cache, data ?? null, _variables);
      afterRef.current.promise = promise;

      promise.finally(() => {
        // after completed
        if (promise === afterRef.current.promise) {
          afterRef.current.promise = null;
          setAfterCount((afterCount) => afterCount + 1);
        }
      });
    }
  }

  loading ||= afterCount !== afterRef.current.count;

  return {
    get query() {
      return this;
    },
    queryDef,
    data,
    loading,
    depsLoading,
    initialLoading,
    ...rest
  };
}
