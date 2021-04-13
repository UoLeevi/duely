import { useQuery, current_subdomain_Q } from '@duely/client';
import { useClassName, Sidebar } from '@duely/react';
import {
  BsBriefcase,
  BsCreditCard,
  BsGear,
  BsHouseDoor,
  BsLayoutTextWindowReverse,
  BsPeople
} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { ApiLink } from './ApiLink';

const sidebarLinks = [
  {
    text: 'Home',
    icon: BsHouseDoor,
    to: '/dashboard',
    exact: true
  },
  {
    text: 'Orders',
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '1.05em', height: '1.05em' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          {...props}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    },
    to: '/dashboard/orders'
  },
  {
    text: 'Products',
    icon: BsBriefcase,
    to: '/dashboard/products'
  },
  {
    text: 'Customers',
    icon: BsPeople,
    to: '/dashboard/customers'
  },
  {
    text: 'Payments',
    icon: BsCreditCard,
    to: '/dashboard/payments'
  },
  {
    text: 'Site',
    icon: BsLayoutTextWindowReverse,
    to: '/dashboard/site/pages'
  },
  {
    text: 'Settings',
    icon: BsGear,
    to: '/dashboard/settings'
  }
];

function AgencyLogo({ src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <Link
      to="/"
      className="relative items-center hidden h-8 p-1 space-x-2 text-gray-900 rounded md:flex sm:h-10 md:h-12"
    >
      <img className="h-full" src={src} alt="logo" {...props} />
    </Link>
  );
}

type DashboardLayoutProps = {
  children?: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  useClassName(document.documentElement, 'bg-gray-25');
  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  const logoSrc = current_subdomain?.agency.theme.image_logo!.data;

  return (
    <div className="relative w-full h-full">
      <Sidebar
        className="fixed inset-x-0 bottom-0"
        links={sidebarLinks}
        topContent={logoSrc && <AgencyLogo src={logoSrc} />}
        bottomContent={<ApiLink />}
      />
      <div className="box-border w-full h-full pb-20 md:pb-0 md:pl-48 xl:pl-64">
        <div className="flex flex-col h-full px-2 py-4 space-y-8 sm:px-4">{children}</div>
      </div>
    </div>
  );
}
