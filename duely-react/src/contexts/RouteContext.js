import React, { createContext, useContext, useRef, useCallback } from 'react';
import useAppState from 'hooks/useAppState';

export const RouteContext = createContext();

function RouteContextProvider({ children }) {
  const [state, ] = useAppState();
  let { activeRoute, data } = state.context.routeRef.state.context;

  while (activeRoute && !activeRoute.route.element) {
    ({ activeRoute, data } = activeRoute.ref.state.context);
  }

  return (
    <RouteContext.Provider value={{ activeRoute, _data: data }}>
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
