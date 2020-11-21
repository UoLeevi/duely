import { useQuery, current_subdomain_Q } from '@duely/client';
import { useClassName, Sidebar } from '@duely/react';
import { BsBriefcase, BsCreditCard, BsFolder, BsGear, BsHouseDoor, BsKanban, BsPeople } from 'react-icons/bs';
// import TopBar from 'components/TopBar';

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

export function DashboardLayout({ children }) {
  useClassName(document.documentElement, 'bg-gray-25');
  const { data: current_subdomain } = useQuery(current_subdomain_Q);

  return (
    <div className="relative w-full">
      <Sidebar className="fixed inset-x-0 bottom-0" links={sidebarLinks} logo={current_subdomain?.agency.theme.image_logo.data} />
      <div className="pb-20 md:pb-0 md:pl-48 xl:pl-64 w-full box-border">
        <div className="flex flex-col p-4 space-y-8">
          { children }
        </div>
      </div>
    </div>
  );
}
