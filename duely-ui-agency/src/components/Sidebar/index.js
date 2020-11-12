import { Link, NavLink } from 'react-router-dom';
import { BsBriefcase, BsCreditCard, BsFolder, BsGear, BsHouseDoor, BsKanban, BsPeople } from 'react-icons/bs';
import { Util } from '@duely/react';
import { useQuery } from '@duely/client';
import { current_subdomain_Q } from 'queries';

function SidebarLink({ text, icon, to }) {
  const Icon = icon;
  return (
    <NavLink to={to} exact activeClassName='bg-gray-200 text-gray-700 active' className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-3 rounded-md bg-white text-xs md:text-sm font-semibold text-gray-600 px-2 md:px-3 py-2">
      <Icon className="text-xl md:text-2xl" />
      <span>{text}</span>
    </NavLink>
  );
}

export default function Sidebar({ className }) {
  const { data: current_subdomain } = useQuery(current_subdomain_Q);

  className = Util.createClassName(className, 'border-box z-10 w-full md:w-48 md:h-screen bg-white border-t md:border-t-none md:border-r p-2');

  return (
    <aside className={className}>
      <div className="md:h-full w-full flex md:flex-col md:space-y-4 max-w-screen overflow-x-auto pb-2 md:pb-0">
        <Link to="/" className="hidden md:flex items-center h-8 sm:h-10 md:h-12 relative space-x-2 text-gray-900 rounded p-1">
          <img className="h-full" src={current_subdomain?.agency.theme.image_logo.data} alt='logo' />
        </Link>
        <nav className="flex flex-row md:flex-col flex-1 justify-center md:justify-start space-x-1 md:space-y-2 md:space-x-0">
          <SidebarLink text="Home" icon={BsHouseDoor} to="/dashboard" />
          <SidebarLink text="Projects" icon={BsKanban} to="/dashboard/projects" />
          <SidebarLink text="Services" icon={BsBriefcase} to="/dashboard/services" />
          <SidebarLink text="Clients" icon={BsPeople} to="/dashboard/clients" />
          <SidebarLink text="Payments" icon={BsCreditCard} to="/dashboard/payments" />
          <SidebarLink text="Files" icon={BsFolder} to="/dashboard/files" />
          <SidebarLink text="Settings" icon={BsGear} to="/dashboard/settings" />
        </nav>
      </div>
    </aside>
  );
}
