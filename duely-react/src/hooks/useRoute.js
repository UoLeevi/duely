import { useContext } from 'react';
import { RouteContext } from 'contexts/RouteContext';

export default function useRoute() {
  const { route, path, params, data } = useContext(RouteContext);
  return { route, path, params, data };
}
