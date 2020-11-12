import { Link } from 'react-router-dom';
import NavMenu from 'components/NavMenu';
import { useQuery } from '@duely/client';
import { current_subdomain_Q } from 'queries';

export default function TopBar() {
  const { data: current_subdomain } = useQuery(current_subdomain_Q);

  return (
    <header className="h-12 md:h-16 z-10 px-3 md:px-4 box-border border-b border-gray-300 fixed top-0 inset-x-0 bg-white">
      <div className="container h-full mx-auto box-border flex items-center justify-between">
        <Link to="/" className="flex items-center h-8 md:h-12 relative space-x-2 text-gray-900 rounded p-1">
          <img className="h-full" src={current_subdomain?.agency.theme.image_logo.data} alt='logo' />
          <span className="text-2xl font-bold">{ current_subdomain?.agency?.name }</span>
        </Link>
        <div className="relative inline-block">
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
