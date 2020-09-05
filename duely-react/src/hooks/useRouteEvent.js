import { useRef, useEffect } from 'react';
import useRoute from 'hooks/useRoute';
import { routeCallbacks } from 'state/route';

export default function useRouteEvent(type, listener, route) {
  const { route: currentRoute } = useRoute();

  if (!route) {
    route = currentRoute;
  }

  const ref = useRef();
  let callbacks = undefined;

  if (route) {
    const eventCallbacks = routeCallbacks[type];
    console.assert(eventCallbacks, `Event '${type}' is not a valid route event.`);
    callbacks = eventCallbacks.get(route);

    if (!callbacks) {
      callbacks = new Map()
      eventCallbacks.set(route, callbacks);
    }

    // Using a ref as a unique indetifier for a calling component seems
    // not to work when using concurrent mode. Multiple non-equal refs
    // are returned by useRef above.
    callbacks.set(ref, listener);
  }

  useEffect(() => () => {
    if (callbacks) {
      callbacks.delete(ref);
    }
  }, [callbacks]);

  return ref.current;
}
