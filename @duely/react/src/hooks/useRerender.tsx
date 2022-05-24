import { useState, useCallback, useLayoutEffect } from 'react';

type UseRerenderState = {
  isRendering: boolean;
  rerenderingPending: boolean;
};

const initializeState: () => UseRerenderState = () => ({
  isRendering: false,
  rerenderingPending: false
});

const increment = (i: number) => i + 1;

const rerender = (
  state: UseRerenderState,
  counter: [unknown, React.Dispatch<React.SetStateAction<number>>]
) => {
  state.rerenderingPending = false;
  counter[1](increment);
};

export function useRerender() {
  const counter = useState(0);
  const [state] = useState(initializeState);

  state.isRendering = true;

  useLayoutEffect(() => {
    state.isRendering = false;
    if (state.rerenderingPending) rerender(state, counter);
  });

  return useCallback(
    (defer?: boolean) => {
      if (state.isRendering || defer) {
        state.rerenderingPending = true;
      } else {
        rerender(state, counter);
      }
    },
    [state]
  );
}
