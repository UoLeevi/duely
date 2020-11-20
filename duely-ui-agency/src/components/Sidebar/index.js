import { Link, useRouteMatch } from 'react-router-dom';
import { BsBriefcase, BsBriefcaseFill, BsCreditCard, BsFolder, BsFolderFill, BsGear, BsGearFill, BsHouseDoor, BsHouseDoorFill, BsKanban, BsKanbanFill, BsPeople, BsPeopleFill } from 'react-icons/bs';
import { Util } from '@duely/react';
import { useQuery, current_subdomain_Q } from '@duely/client';

const sidebarLinks = [
  {
    text: "Home",
    icons: [BsHouseDoor, BsHouseDoorFill],
    to: '/dashboard',
    exact: true
  },
  {
    text: "Projects",
    icons: [BsKanban, BsKanbanFill],
    to: '/dashboard/projects',
  },
  {
    text: "Services",
    icons: [BsBriefcase, BsBriefcaseFill],
    to: '/dashboard/services',
  },
  {
    text: "Clients",
    icons: [BsPeople, BsPeopleFill],
    to: '/dashboard/clients',
  },
  {
    text: "Payments",
    icons: [BsCreditCard, BsCreditCard],
    to: '/dashboard/payments',
  },
  {
    text: "Files",
    icons: [BsFolder, BsFolderFill],
    to: '/dashboard/files',
  },
  {
    text: "Settings",
    icons: [BsGear, BsGearFill],
    to: '/dashboard/settings',
  },
];

function SidebarLink({ text, icons, to, exact, className }) {
  const match = useRouteMatch({ path: to, exact });
  const Icon = icons[match ? 1 : 0];
  className = Util.createClassName(className,
    match ? 'text-gray-600 md:bg-white md:shadow-sm' : 'text-gray-500 border-transparent',
    'flex flex-col md:flex-row items-center md:border space-y-1 md:space-y-0 md:space-x-3 rounded-md text-xs shadow-gray-500 md:text-sm font-semibold px-2 md:px-3 py-2 focus-visible:bg-white')
  return (
    <Link to={to} className={className}>
      <Icon className="text-lg sm:text-xl md:text-2xl" />
      <span>{text}</span>
    </Link>
  );
}

export default function Sidebar({ className }) {
  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  className = Util.createClassName(className, 'bg-white md:bg-gray-25 border-t md:border-none border-box z-10 w-full md:w-48 xl:w-64 h-16 md:h-full md:h-screen md:p-2');

  return (
    <aside className={className}>
      <div className="md:h-full w-full flex md:flex-col md:space-y-4 max-w-screen overflow-x-auto pb-2 md:pb-0">
        <Link to="/" className="hidden md:flex items-center h-8 sm:h-10 md:h-12 relative space-x-2 text-gray-900 rounded p-1">
          <img className="h-full" src={current_subdomain?.agency.theme.image_logo.data} alt='logo' />
        </Link>
        <nav className="flex flex-row md:flex-col flex-1 justify-center md:justify-start space-x-1 md:space-y-2 md:space-x-0 p-1">
          {sidebarLinks.map((props, i) => (
            <SidebarLink key={i} { ...props } />
          ))}
        </nav>
      </div>
    </aside>
  );
}
