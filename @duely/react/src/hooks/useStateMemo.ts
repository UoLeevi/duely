import { useRerender } from '@duely/react-form';
import { useRef, useState } from 'react';
import { usePrevious } from './usePrevious';

const initialStateSymbol = Symbol();

export function useStateMemo<S, D extends readonly unknown[] = readonly unknown[]>(
  initialState: S | ((...deps: D) => S),
  deps?: D
): [S, (value: S | ((prevState: S, ...deps: D) => S)) => void] {
  const prevDeps = usePrevious(deps);
  const depsChanged =
    !(prevDeps === undefined && prevDeps === undefined) &&
    (prevDeps?.length !== deps?.length ||
      !prevDeps?.every((value, index) => value === deps?.[index]));

  const stateRef = useRef<
    [S, (value: S | ((prevState: S, ...deps: D) => S)) => void] | typeof initialStateSymbol
  >(initialStateSymbol);

  if (depsChanged) {
    stateRef.current = initialStateSymbol;
  }

  const rerender = useRerender();

  const context = {
    stateRef,
    deps,
    rerender
  };

  const contextRef = useRef<typeof context>(context);
  contextRef.current = context;

  const [setState] = useState(() => {
    return (value: S | ((prevState: S, ...deps: D) => S)) => {
      const [prevState, setState] = contextRef.current.stateRef.current as any as [
        S,
        (value: S | ((prevState: S, ...deps: D) => S)) => void
      ];

      if (value === prevState) return;

      if (typeof value === 'function') {
        const state = (value as any)(prevState, ...(contextRef.current.deps ?? [])) as S;
        if (state === prevState) return;
        stateRef.current = [state, setState];
        contextRef.current.rerender();
      } else {
        stateRef.current = [value, setState];
        contextRef.current.rerender();
      }
    };
  });

  if (stateRef.current === initialStateSymbol) {
    if (typeof initialState === 'function') {
      const state = (initialState as any)(...(deps ?? []));
      stateRef.current = [state, setState];
    } else {
      const state = initialState as S;
      stateRef.current = [state, setState];
    }
  }

  return stateRef.current as [S, (value: S | ((prevState: S, ...deps: D) => S)) => void];
}
