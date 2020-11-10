import { Link, NavLink } from 'react-router-dom';
import DuelyLogo from 'components/DuelyLogo';
import { BsBriefcase, BsCreditCard, BsFolder, BsGear, BsHouseDoor, BsKanban, BsPeople } from 'react-icons/bs';
import { Util } from '@duely/react';

export default function Sidebar({ className }) {
  className = Util.createClassName(className, 'border-box z-10 w-full md:w-64 md:h-screen bg-white border-t md:border-t-none md:border-r p-2');

  return (
    <aside className={className}>
      <div className="md:h-full w-full flex md:flex-col md:space-y-4 max-w-screen overflow-x-auto">
        <Link to="/" className="hidden md:flex items-center h-8 sm:h-10 md:h-12 relative space-x-2 text-gray-900 rounded p-1">
          <DuelyLogo className="h-full" />
          <span className="text-xl sm:text-2xl font-bold">Duely</span>
        </Link>
        <nav className="flex flex-row md:flex-col flex-1 justify-center md:justify-start space-x-1 md:space-y-2 md:space-x-0">
          <NavLink to="/dashboard" exact activeClassName='bg-gray-200 text-gray-700 active' className="flex flex-row items-center space-x-3 rounded-md bg-white text-sm font-semibold text-gray-600 px-3 py-2">
            <BsHouseDoor className="text-2xl" />
            <span className="hidden md:inline router-link-active:inline">Home</span>
          </NavLink>
          <NavLink to="/dashboard/projects" exact activeClassName='bg-gray-200 text-gray-700 active' className="flex flex-row items-center space-x-3 rounded-md bg-white text-sm font-semibold text-gray-600 px-3 py-2">
            <BsKanban className="text-2xl" />
            <span className="hidden md:inline router-link-active:inline">Projects</span>
          </NavLink>
          <NavLink to="/dashboard/services" exact activeClassName='bg-gray-200 text-gray-700 active' className="flex flex-row items-center space-x-3 rounded-md bg-white text-sm font-semibold text-gray-600 px-3 py-2">
            <BsBriefcase className="text-2xl" />
            <span className="hidden md:inline router-link-active:inline">Services</span>
          </NavLink>
          <NavLink to="/dashboard/clients" exact activeClassName='bg-gray-200 text-gray-700 active' className="flex flex-row items-center space-x-3 rounded-md bg-white text-sm font-semibold text-gray-600 px-3 py-2">
            <BsPeople className="text-2xl" />
            <span className="hidden md:inline router-link-active:inline">Clients</span>
          </NavLink>
          <NavLink to="/dashboard/payments" exact activeClassName='bg-gray-200 text-gray-700 active' className="flex flex-row items-center space-x-3 rounded-md bg-white text-sm font-semibold text-gray-600 px-3 py-2">
            <BsCreditCard className="text-2xl" />
            <span className="hidden md:inline router-link-active:inline">Payments</span>
          </NavLink>
          <NavLink to="/dashboard/files" exact activeClassName='bg-gray-200 text-gray-700 active' className="flex flex-row items-center space-x-3 rounded-md bg-white text-sm font-semibold text-gray-600 px-3 py-2">
            <BsFolder className="text-2xl" />
            <span className="hidden md:inline router-link-active:inline">Files</span>
          </NavLink>
          <NavLink to="/dashboard/settings" exact activeClassName='bg-gray-200 text-gray-700 active' className="flex flex-row items-center space-x-3 rounded-md bg-white text-sm font-semibold text-gray-600 px-3 py-2">
            <BsGear className="text-2xl" />
            <span className="hidden md:inline router-link-active:inline">Settings</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
