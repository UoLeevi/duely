import React, { createContext, useContext, useRef, useCallback } from 'react';
import useAppState from 'hooks/useAppState';

export const RouteContext = createContext();

function RouteContextProvider({ children }) {
  const [state, ] = useAppState();
  let { active } = state.context.routeRef.state.context;
  const { route, path, params } = active ?? {};

  while (active && !active.route.element) {
    active = active.ref.state.context.active;
  }

  return (
    <RouteContext.Provider value={{ active, route, path, params }}>
      { children }
    </RouteContext.Provider>
  );
}

export function withRouteContext(Fn) {
  return (
    <RouteContextProvider>
      <Fn />
    </RouteContextProvider>
  );
}

export default RouteContextProvider;
