import React, { createContext, useContext, useRef, useCallback } from 'react';
import useAppState from 'hooks/useAppState';

export const RoutingContext = createContext();

function RoutingContextProvider({ children }) {
  const context = useContext(RoutingContext);
  const [state, ] = useAppState();
  let { activeRoute } = context === undefined
    ? state.context.routeRef.state.context
    : context.activeRoute.ref.state.context;

  while (activeRoute && !activeRoute.route.element) {
    ({ activeRoute } = activeRoute.ref.state.context);
  }

  const route = activeRoute?.route;
  const element = route && <RoutingContextProvider children={route.element} />;

  return (
    <RoutingContext.Provider value={{ activeRoute, route, element }}>
      { children }
    </RoutingContext.Provider>
  );
}

export function withRoutingContext(Fn) {
  return (
    <RoutingContextProvider>
      <Fn />
    </RoutingContextProvider>
  );
}

export default RoutingContextProvider;
