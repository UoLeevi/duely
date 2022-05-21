import { useState, useCallback, useLayoutEffect } from 'react';

type UseRerenderState = {
  isRendering: boolean;
  rerenderingPendingTimeout: number;
};

const initializeState: () => UseRerenderState = () => ({
  isRendering: false,
  rerenderingPendingTimeout: 0
});

const increment = (i: number) => i + 1;

export function useRerender() {
  const [, setCounter] = useState(0);
  const [state] = useState(initializeState);

  state.isRendering = true;

  const rerender = () => {
    window.clearTimeout(state.rerenderingPendingTimeout);
    state.rerenderingPendingTimeout = 0;
    setCounter(increment);
    state.isRendering = false;
  };

  useLayoutEffect(() => {
    state.isRendering = false;

    if (state.rerenderingPendingTimeout) rerender();

    return () => {
      window.clearTimeout(state.rerenderingPendingTimeout);
      state.rerenderingPendingTimeout = 0;
    };
  });

  return useCallback(
    (defer?: boolean) => {
      if (state.isRendering || defer) {
        state.rerenderingPendingTimeout = window.setTimeout(rerender, 0);
      } else {
        window.clearTimeout(state.rerenderingPendingTimeout);
        state.rerenderingPendingTimeout = 0;
        setCounter(increment);
      }
    },
    [state]
  );
}
