import { useContext } from 'react';
import { RouteContext } from 'contexts/RouteContext';

export default function useRoute() {
  const { route, path, params } = useContext(RouteContext);
  return { route, path, params };
}
