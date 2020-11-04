import { useCallback, useState } from 'react';
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

export function useMutation(mutationDef) {
  const [state, setState] = useState(initialState);
  const mutate = useCallback(async (variables, options) => {
    setState(loadingState);

    try {
      const res = await _mutate(mutationDef, variables, options);

      if (res.success === false) {
        setState(createErrorState(res));
      } else {
        setState(createCompletedState(res));
      }

    } catch (error) {
      setState(createErrorState(error));
    }
  }, [mutationDef]);

  return [mutate, state];
}
