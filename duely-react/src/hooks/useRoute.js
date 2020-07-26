import { useContext } from 'react';
import { RouteContext } from 'contexts/RouteContext';

export default function useRoute() {
  const { data, route } = useContext(RouteContext);
  return { data, ...route };
}
