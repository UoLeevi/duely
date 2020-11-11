import { useQuery } from '@duely/client';
import { current_subdomain_Q } from 'queries';

export default function DomainManager({ children }) {
  const { data, loading, error } = useQuery(current_subdomain_Q);

  if (loading) {
    return 'Loading...';
  }

  if (error) {
    console.error(error);
    return 'Error';
  }

  if (process.env.NODE_ENV === 'production') {
    if (!error || data == null) {
      window.location.replace("https://duely.app");
      return null;
    }
  }

  return children ?? null;
}

