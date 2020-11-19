import { useQuery, current_subdomain_Q } from '@duely/client';
import { LoadingScreen, ErrorScreen } from '@duely/react';

export default function DomainManager({ children }) {
  const { data, loading, error } = useQuery(current_subdomain_Q);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  if (data == null) {
    window.location.replace("https://duely.app");
    return null;
  }

  return children ?? null;
}

