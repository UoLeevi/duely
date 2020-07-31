import React, { useContext } from 'react';
import { RouteContext } from 'contexts/RouteContext';

function Route() {
  let { active, data } = useContext(RouteContext);
  
  if (!active) {
    return null;
  }

  const { route, path, params } = active ?? {};
  const element = route?.element;

  do {
    active = active.ref.state.context.active;
    data = { ...data, ...active?.data };
  } while (active && !active.route.element);

  return <RouteContext.Provider value={{ active, route, path, params, data }} children={ element } />;
};

export default Route;
