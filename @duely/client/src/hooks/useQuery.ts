import {
  QueryFunctionOptions,
  TypedDocumentNode,
  useQuery as useApolloQuery
} from '@apollo/client';
import { stringifySorted } from '@duely/util';
import { useEffect, useRef, useState } from 'react';
import { client } from '../apollo';
import { query, QueryDefinition, TypedQueryOptions } from '../queries';

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
  options?: { deps?: TDeps; skip?: boolean } & Omit<
    TypedQueryOptions<TypedDocumentNode<TData, TVariables>>,
    'query' | 'variables'
  >
): UseQueryReturn<TResult> {
  const [, setRerenderCount] = useState(0);
  const ref = useRef<{
    key: any | undefined;
    variablesKey: string;
    loading: boolean;
    data: TResult | null;
    isMounted: boolean;
  }>({
    key: undefined,
    variablesKey: '',
    loading: false,
    data: null,
    isMounted: false
  });

  useEffect(() => {
    ref.current.isMounted = true;
    return () => {
      ref.current.isMounted = false;
    };
  }, []);

  const {
    query: document,
    result,
    after,
    variables: defaultVariables,
    ...defaultOptions
  } = queryDef;
  const depsLoading = options?.deps?.some((dep) => dep.loading || !dep.data) ?? false;

  const skip = options?.skip || depsLoading || false;

  if (skip) {
    return {
      get query() {
        return this;
      },
      queryDef,
      data: undefined,
      loading: false,
      depsLoading,
      initialLoading: false
    };
  }

  const _variables = {
    ...defaultVariables,
    ...(typeof variables === 'function'
      ? depsLoading
        ? undefined
        : variables(...(options?.deps?.map((d) => d.data)! as any))
      : variables)!
  };

  const _options = { ...defaultOptions, ...options };
  const variablesKey = stringifySorted(_variables);

  if (ref.current.key === undefined || ref.current.variablesKey !== variablesKey) {
    const cachedValue = client.readQuery({ query: queryDef.query, variables: _variables });
    if (cachedValue !== null) {
      ref.current.variablesKey = variablesKey;
      ref.current.loading = false;
      ref.current.data = result(cachedValue);
      ref.current.key = cachedValue;
    } else {
      ref.current.variablesKey = variablesKey;
      ref.current.loading = true;
      ref.current.data = null;
      ref.current.key = query(queryDef, _variables, _options).then((r) => {
        if (ref.current.variablesKey !== variablesKey) return;
        ref.current.loading = false;
        ref.current.data = r;
        if (ref.current.isMounted) setRerenderCount((c) => c + 1);
      });
    }
  }

  const loading = depsLoading || ref.current.loading;

  return {
    get query() {
      return this;
    },
    queryDef,
    data: ref.current.data,
    loading,
    depsLoading,
    initialLoading: loading
  };
}
