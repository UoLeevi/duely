import { useCallback, useRef, useState } from 'react';
import { MutationDefinition, TypedMutationOptions } from '../mutations';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { mutate as _mutate } from '../mutations';
import { MutationResult } from '@duely/core';

type MutationState<T> = {
  loading: boolean;
  error: Error | { message?: string | null } | undefined;
  data: T | null | undefined;
};

const initialState = {
  loading: false,
  error: undefined,
  data: undefined
};

const loadingState = {
  loading: true,
  error: undefined,
  data: undefined
};

const createCompletedState: <T>(data: T | null | undefined) => MutationState<T> = (data) => ({
  loading: false,
  error: undefined,
  data
});

const createErrorState: <T>(error: Error | { message?: string | null }) => MutationState<T> = (
  error
) => ({
  loading: false,
  error,
  data: undefined
});

type MutationHookOptions = {
  resetErrorMs: number;
};

const defaultOptions: MutationHookOptions = {
  resetErrorMs: 6000
};

export function useMutation<
  TData,
  TVariables extends TBoundVariables,
  TBoundVariables extends { [key: string]: any },
  TResult extends MutationResult
>(
  mutationDef: MutationDefinition<TData, TVariables, TBoundVariables, TResult>,
  options?: MutationHookOptions
): [
  (
    variables: Pick<TVariables, Exclude<keyof TVariables, never>>,
    options: Omit<
      TypedMutationOptions<TypedDocumentNode<TData, TVariables>>,
      'mutation' | 'variables'
    >
  ) => Promise<TResult | null | undefined>,
  MutationState<TResult>
] {
  const timeoutRef = useRef(0);
  const { resetErrorMs } = { ...defaultOptions, ...options };
  const [state, setState] = useState<MutationState<TResult>>(initialState);
  const mutate = useCallback(
    async (
      variables: Omit<TVariables, keyof typeof mutationDef.variables>,
      options: Omit<
        TypedMutationOptions<TypedDocumentNode<TData, TVariables>>,
        'mutation' | 'variables'
      >
    ) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = 0;
      }

      setState(loadingState);

      try {
        const res = await _mutate(mutationDef, variables, options);

        if (res && !res.success) {
          setState(createErrorState(res));

          if (resetErrorMs > 0) {
            timeoutRef.current = window.setTimeout(() => setState(initialState), resetErrorMs);
          }
        } else {
          setState(createCompletedState(res));
        }

        return res;
      } catch (error) {
        setState(createErrorState(error));

        if (resetErrorMs > 0) {
          timeoutRef.current = window.setTimeout(() => setState(initialState), resetErrorMs);
        }

        return null;
      }
    },
    [mutationDef, resetErrorMs]
  );

  return [mutate, state];
}
