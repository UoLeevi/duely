import { useQuery, current_subdomain_Q } from '@duely/client';

export default function DomainManager({ children }) {
  const { data, loading, error } = useQuery(current_subdomain_Q);

  if (loading) {
    return <span className="font-medium text-sm text-gray-700">Loading...</span>;
  }

  if (error) {
    console.error(error);
    return <span className="font-medium text-sm text-red-400">Error</span>;;
  }

  if (process.env.NODE_ENV === 'production') {
    if (error || data == null) {
      window.location.replace("https://duely.app");
      return null;
    }
  }

  return children ?? null;
}

