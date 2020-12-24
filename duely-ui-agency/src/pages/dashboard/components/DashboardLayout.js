import { useQuery, current_subdomain_Q } from '@duely/client';
import { useClassName, Sidebar } from '@duely/react';
import { BsBriefcase, BsCreditCard, BsFolder, BsGear, BsHouseDoor, BsKanban, BsPeople } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const sidebarLinks = [
  {
    text: "Home",
    icon: BsHouseDoor,
    to: '/dashboard',
    exact: true
  },
  {
    text: "Projects",
    icon: BsKanban,
    to: '/dashboard/projects',
  },
  {
    text: "Services",
    icon: BsBriefcase,
    to: '/dashboard/services',
  },
  {
    text: "Clients",
    icon: BsPeople,
    to: '/dashboard/clients',
  },
  {
    text: "Payments",
    icon: BsCreditCard,
    to: '/dashboard/payments',
  },
  {
    text: "Files",
    icon: BsFolder,
    to: '/dashboard/files',
  },
  {
    text: "Settings",
    icon: BsGear,
    to: '/dashboard/settings',
  },
];

function AgencyLogo({ src }) {
  return (
    <Link to="/" className="relative items-center hidden h-8 p-1 space-x-2 text-gray-900 rounded md:flex sm:h-10 md:h-12">
      <img className="h-full" src={src} alt='logo' />
    </Link>
  );
}

export function DashboardLayout({ children }) {
  useClassName(document.documentElement, 'bg-gray-25');
  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  const logoSrc = current_subdomain?.agency.theme.image_logo.data;

  return (
    <div className="relative w-full">
      <Sidebar className="fixed inset-x-0 bottom-0"
        links={sidebarLinks}
        topContent={logoSrc && <AgencyLogo src={logoSrc} />}
      />
      <div className="box-border w-full pb-20 md:pb-0 md:pl-48 xl:pl-64">
        <div className="flex flex-col px-2 py-4 space-y-8 sm:px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
