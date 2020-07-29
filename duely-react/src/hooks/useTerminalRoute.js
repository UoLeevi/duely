import useAppState from 'hooks/useAppState';

export default function useTerminalRoute() {
  const [state, ] = useAppState();
  let { active } = state.context.routeRef.state.context;

  if (!active) {
    return {};
  }

  while (active.ref.state.context.active) {
    active = active.ref.state.context.active;
  }

  const { route, path, params, data } = active;
  return { route, path, params, data };
}
