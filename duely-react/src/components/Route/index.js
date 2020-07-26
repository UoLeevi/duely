import React, { useContext } from 'react';
import { RouteContext } from 'contexts/RouteContext';

function Route() {
  let { activeRoute, _data } = useContext(RouteContext);
  
  if (!activeRoute) {
    return null;
  }

  const route = activeRoute.route;
  const element = route?.element;
  let data = undefined;

  do {
    ({ activeRoute, data } = activeRoute.ref.state.context);
  } while (activeRoute && !activeRoute.route.element);

  return <RouteContext.Provider value={{ activeRoute, route, data: _data, _data: data }} children={ element } />;
};

export default Route;
