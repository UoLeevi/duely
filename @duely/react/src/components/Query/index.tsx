import { QueryControl, UseQueryReturn } from '@duely/client/dist/hooks/useQuery';
import React, { Context, createContext, useContext } from 'react';

const defaultControl = {
  queryDef: null,
  data: null,
  error: undefined,
  loading: false,
  initialLoading: false,
  depsLoading: false
};

const RootQueryContext = createContext<UseQueryReturn<unknown>>({
  control: defaultControl,
  ...defaultControl
});

const contexts = new Map<QueryControl<unknown>['queryDef'], Context<UseQueryReturn<unknown>>>();

function getOrCreateQueryContext<T = unknown>(queryDef: QueryControl<T>['queryDef']) {
  let context = contexts.get(queryDef);

  if (!context) {
    const control = {
      queryDef,
      data: null,
      error: undefined,
      loading: false,
      initialLoading: false,
      depsLoading: false
    };

    context = createContext<UseQueryReturn<unknown>>({
      control,
      ...control
    });

    contexts.set(queryDef, context);
  }

  return context;
}

export function useQueryState<T>(queryDef?: QueryControl<T>['queryDef']): UseQueryReturn<T> {
  const context = queryDef ? contexts.get(queryDef) : RootQueryContext;

  if (!context) throw new Error('Query contex was not found.');

  return useContext(context) as UseQueryReturn<T>;
}

export type QueryProps<T> = {
  children: React.ReactNode;
  control: QueryControl<T>;
};

export function Query<T>({ children, control }: QueryProps<T>) {
  const prev = useQueryState();

  const error = control.error ?? prev.error ?? undefined;
  const initialLoading = control.initialLoading || prev.initialLoading || false;
  const loading = initialLoading || control.loading || prev.loading || false;
  const QueryContext = getOrCreateQueryContext(control.queryDef);
  const value = { control, ...control, error, loading, initialLoading };

  return (
    <RootQueryContext.Provider value={value}>
      <QueryContext.Provider value={value}>{children}</QueryContext.Provider>
    </RootQueryContext.Provider>
  );
}
