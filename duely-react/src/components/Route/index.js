import React, { useContext } from 'react';
import { RouteContext } from 'contexts/RouteContext';

function Route() {
  let { active } = useContext(RouteContext);
  
  if (!active) {
    return null;
  }

  const { route, path, params } = active ?? {};
  const element = route?.element;

  do {
    active = active.ref.state.context.active;
  } while (active && !active.route.element);

  return <RouteContext.Provider value={{ active, route, path, params }} children={ element } />;
};

export default Route;
