import React, { useContext } from 'react';
import { RouteContext } from 'contexts/RouteContext';

const Route = React.forwardRef((props, ref) => {
  let { active, data } = useContext(RouteContext);
  
  if (!active) {
    return null;
  }

  const { route, path, params } = active ?? {};
  const element = route?.element && React.cloneElement(route.element, { ...props, ref });

  do {
    active = active.ref.state.context.active;
    data = { ...data, ...active?.data };
  } while (active && !active.route.element);

  return <RouteContext.Provider value={{ active, route, path, params, data }} children={ element } />;
});

export default Route;
