import { useState, useCallback, useLayoutEffect } from 'react';

function initializeState() {
  return {
    isRendering: false,
    rerenderingPending: false
  };
}

export function useRerender() {
  const [, setCounter] = useState(0);
  const [state] = useState(initializeState);

  state.isRendering = true;

  useLayoutEffect(() => {
    state.isRendering = false;

    if (state.rerenderingPending) {
      state.rerenderingPending = false;
      setCounter((i) => i + 1);
    }
  });

  return useCallback((defer?: boolean) => {
    if (state.isRendering || defer) {
      state.rerenderingPending = true;
    } else {
      state.rerenderingPending = false;
      setCounter((i) => i + 1);
    }
  }, [state]);
}
