import useAppState from 'hooks/useAppState';

export default function useActiveRouteState(parentRoute) {
  const [{ context: { routeRef = {} }}, send] = useAppState();
  const { state } = routeRef;

  if (!parentRoute) {
    return [state, send];
  }
}
