import { useQuery, current_subdomain_Q } from '@duely/client';
import { LoadingScreen, ErrorScreen } from '@duely/react';
import { useEffect } from 'react';

type DomainManagerProps = {
  children?: React.ReactNode;
};

export default function DomainManager({ children }: DomainManagerProps) {
  const { data, loading, error } = useQuery(current_subdomain_Q);

  const invalidSubdomain = !loading && !error && !data;

  useEffect(() => {
    if (invalidSubdomain) {
      window.location.replace('https://duely.app');
    }
  }, [invalidSubdomain]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  return invalidSubdomain ? null : <>{children}</> ?? null;
}
