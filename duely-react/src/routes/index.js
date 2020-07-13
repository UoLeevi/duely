import { useContext } from 'react';
import { useRoutes } from 'react-router-dom';
import { DomainContext } from 'contexts/DomainContext';
import duely from './duely';
import agency from './agency';

const RoutesRoot = () => {
  const { subdomain } = useContext(DomainContext);
  return useRoutes(subdomain === null ? duely : agency);
};

export {
  RoutesRoot
};
