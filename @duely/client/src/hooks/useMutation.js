import { useCallback, useRef, useState } from 'react';
import { mutate as _mutate } from '../mutations';

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

const createCompletedState = data => ({
  loading: false,
  error: undefined,
  data
});

const createErrorState = error => ({
  loading: false,
  error,
  data: undefined
});

const defaultOptions = {
  resetErrorMs: 6000
};

export function useMutation(mutationDef, options) {
  const timeoutRef = useRef(0);
  const { resetErrorMs } = { ...defaultOptions, ...options };
  const [state, setState] = useState(initialState);
  const mutate = useCallback(async (variables, options) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = 0;
    }

    setState(loadingState);

    try {
      const res = await _mutate(mutationDef, variables, options);

      if (res.success === false) {
        setState(createErrorState(res));

        if (resetErrorMs > 0) {
          timeoutRef.current = setTimeout(() => setState(initialState), resetErrorMs);
        }
      } else {
        setState(createCompletedState(res));
      }

      return res;

    } catch (error) {
      setState(createErrorState(error));

      if (resetErrorMs > 0) {
        timeoutRef.current = setTimeout(() => setState(initialState), resetErrorMs);
      }

      return error;
    }
  }, [mutationDef, resetErrorMs]);

  return [mutate, state];
}
