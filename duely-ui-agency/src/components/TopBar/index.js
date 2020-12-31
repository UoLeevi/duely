import { Link } from 'react-router-dom';
import NavMenu from 'components/NavMenu';
import { useQuery, current_subdomain_Q } from '@duely/client';

export default function TopBar() {
  const { data: current_subdomain } = useQuery(current_subdomain_Q);

  return (
    <header className="box-border fixed inset-x-0 top-0 z-10 h-12 px-3 bg-white border-b border-gray-300 md:h-16 md:px-4">
      <div className="container box-border flex items-center justify-between h-full mx-auto">
        <Link to="/" className="relative flex items-center h-8 p-1 space-x-2 text-gray-900 rounded md:h-12">
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
