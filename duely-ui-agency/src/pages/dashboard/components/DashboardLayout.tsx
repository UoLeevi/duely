import { useQuery, current_subdomain_Q } from '@duely/client';
import { useClassName, Sidebar, SidebarProps } from '@duely/react';
import { Link } from 'react-router-dom';
import { ApiLink } from './ApiLink';

const sidebarLinks: SidebarProps['links'] = [
  {
    text: 'Home',
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    to: '/dashboard',
    exact: true
  },
  {
    text: 'Orders',
    name: 'orders',
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    to: '/dashboard/orders',
    items: [
      {
        text: 'Subscriptions',
        to: '/dashboard/orders/subscriptions'
      }
    ]
  },
  {
    text: 'Products',
    name: 'products',
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[1.05em] w-[1.05em]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    to: '/dashboard/products',
    items: [
      {
        text: 'Coupons',
        to: '/dashboard/products/coupons'
      }
    ]
  },
  {
    text: 'Customers',
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[1.05em] w-[1.05em]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    to: '/dashboard/customers'
  },
  {
    text: 'Payments',
    name: 'payments',
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[1.05em] w-[1.05em]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    to: '/dashboard/payments',
    items: [
      {
        text: 'Transactions',
        to: '/dashboard/payments/transactions'
      },
      {
        text: 'Invoices',
        to: '/dashboard/payments/invoices'
      }
    ]
  },
  {
    text: 'Site',
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[1.05em] w-[1.05em]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
    to: '/dashboard/site/pages'
  },
  {
    text: 'Settings',
    name: 'settings',
    icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[1.05em] w-[1.05em]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    items: [
      {
        text: 'Payments',
        to: '/dashboard/settings/payments'
      },
      {
        text: 'Checkout',
        to: '/dashboard/settings/checkout'
      },
      {
        text: 'Integrations',
        to: '/dashboard/settings/integrations'
      },
      {
        text: 'Branding',
        to: '/dashboard/settings/branding'
      },
      {
        text: 'Miscellaneous',
        to: '/dashboard/settings/miscellaneous'
      }
    ]
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
  useClassName(document.documentElement, 'bg-gray-25 dark:bg-gray-900 dark:text-gray-300');
  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  const logoSrc = current_subdomain?.agency.theme.image_logo!.data;

  return (
    <div className="relative flex flex-col flex-1 w-full">
      <Sidebar
        className="fixed inset-x-0 bottom-0"
        links={sidebarLinks}
        topContent={logoSrc && <AgencyLogo src={logoSrc} />}
        bottomContent={<ApiLink />}
      />
      <div className="box-border flex flex-col flex-1 w-full pb-20 md:pb-0 md:pl-48 xl:pl-64">
        <div className="flex flex-col flex-1 px-2 py-4 space-y-8 sm:px-4">{children}</div>
      </div>
    </div>
  );
}
