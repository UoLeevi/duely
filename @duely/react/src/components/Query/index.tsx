import { UseQueryReturn } from '@duely/client/dist/hooks/useQuery';
import React, { Context, createContext, useContext } from 'react';

export type QueryState = {
  data: unknown | null;
  error?: Error;
  loading?: boolean;
  initialLoading?: boolean;
  depsLoading?: boolean;
};

type KeyQueryState<TKey> = TKey extends UseQueryReturn<infer T>['queryDef']
  ? UseQueryReturn<T> & QueryState
  : QueryState;

export type QueryStateControl<TKey> = {
  control: QueryStateControl<TKey>;
} & KeyQueryState<TKey>;

const defaultControl: QueryStateControl<unknown> = {
  get control() {
    return this;
  },
  data: null,
  error: undefined,
  loading: false,
  initialLoading: false,
  depsLoading: false
};

const RootQueryContext = createContext<QueryStateControl<unknown>>(defaultControl);

const contexts = new Map<any, Context<QueryStateControl<unknown>>>();

function getOrCreateQueryContext<TKey>(key: TKey) {
  let context = contexts.get(key);

  if (!context) {
    context = createContext<QueryStateControl<unknown>>({
      get control() {
        return this;
      },
      data: null,
      error: undefined,
      loading: false,
      initialLoading: false,
      depsLoading: false
    } as any);

    contexts.set(key, context);
  }

  return context as unknown as Context<QueryStateControl<TKey>>;
}

export function useQueryState<TKey>(key?: TKey): QueryStateControl<TKey> {
  const context = key ? contexts.get(key) : RootQueryContext;

  if (!context) throw new Error('Query contex was not found.');

  return useContext(context) as QueryStateControl<TKey>;
}

export type QueryProps<TKey> = {
  children: React.ReactNode;
  state: KeyQueryState<TKey>;
  queryKey: TKey;
};

export function Query<TKey>({ children, state, queryKey }: QueryProps<TKey>) {
  const prev = useQueryState();
  const error = state.error ?? prev.error ?? undefined;
  const initialLoading = state.initialLoading || prev.initialLoading || false;
  const loading = initialLoading || state.loading || prev.loading || false;
  const QueryContext = getOrCreateQueryContext(queryKey);
  const value: QueryStateControl<TKey> = {
    get control() {
      return this;
    },
    ...state,
    error,
    loading,
    initialLoading
  } as any;

  return (
    <RootQueryContext.Provider value={value}>
      <QueryContext.Provider value={value}>{children}</QueryContext.Provider>
    </RootQueryContext.Provider>
  );
}
