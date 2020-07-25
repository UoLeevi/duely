import { useContext } from 'react';
import { RoutingContext } from 'contexts/RoutingContext';


function Route() {
  const { element } = useContext(RoutingContext);
  return element;
};

export default Route;
