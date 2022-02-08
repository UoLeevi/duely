import {
  useQuery,
  current_subdomain_Q,
  query,
  subscription_Q,
  agency_stripe_account_Q
} from '@duely/client';
import {
  useClassName,
  Sidebar,
  SidebarProps,
  TopBar2,
  icons,
  Search,
  SearchResult,
  useQueryState,
  ColoredChip,
  Icon
} from '@duely/react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ApiLink } from './ApiLink';

const sidebarLinks: SidebarProps['links'] = [
  {
    text: 'Home',
    icon: ({ ...props }: Omit<React.SVGProps<SVGSVGElement>, 'name' | 'd'>) => (
      <Icon className="w-[1.05em] h-[1.05em]" {...props} name="home" />
    ),
    to: '/dashboard',
    exact: true
  },
  {
    text: 'Orders',
    name: 'orders',
    icon: ({ ...props }: Omit<React.SVGProps<SVGSVGElement>, 'name' | 'd'>) => (
      <Icon className="w-[1.05em] h-[1.05em]" {...props} name="shopping-cart" />
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
    icon: ({ ...props }: Omit<React.SVGProps<SVGSVGElement>, 'name' | 'd'>) => (
      <Icon className="w-[1.05em] h-[1.05em]" {...props} name="briefcase" />
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
    icon: ({ ...props }: Omit<React.SVGProps<SVGSVGElement>, 'name' | 'd'>) => (
      <Icon className="w-[1.05em] h-[1.05em]" {...props} name="users" />
    ),
    to: '/dashboard/customers'
  },
  {
    text: 'Payments',
    name: 'payments',
    icon: ({ ...props }: Omit<React.SVGProps<SVGSVGElement>, 'name' | 'd'>) => (
      <Icon className="w-[1.05em] h-[1.05em]" {...props} name="credit-card" />
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
    icon: ({ ...props }: Omit<React.SVGProps<SVGSVGElement>, 'name' | 'd'>) => (
      <Icon className="w-[1.05em] h-[1.05em]" {...props} name="template" />
    ),
    to: '/dashboard/site/pages'
  },
  {
    text: 'Settings',
    name: 'settings',
    icon: ({ ...props }: Omit<React.SVGProps<SVGSVGElement>, 'name' | 'd'>) => (
      <Icon className="w-[1.05em] h-[1.05em]" {...props} name="cog" />
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

function useSearch() {
  const { data: stripe_account } = useQueryState(agency_stripe_account_Q);
  return useCallback(
    async (searchTerm: string) => {
      const results: React.ReactNode[] = [];

      switch (searchTerm.slice(0, 3)) {
        case 'sub':
          results.push(<SearchResult.DashboardPage page={'subscriptions'} />);
      }

      if (searchTerm.startsWith('sub_')) {
        try {
          const subscription = await query(subscription_Q, {
            stripe_account_id: stripe_account?.id!,
            subscription_id: searchTerm
          });

          results.push(
            <SearchResult to={`/dashboard/orders/subscriptions/${subscription?.id}`}>
              <div className="flex items-baseline space-x-3 text-sm">
                <span className="text-xs font-bold text-gray-500 uppercase">Subscription</span>
                <span>
                  <span>{subscription?.customer?.name ?? subscription?.customer?.email}</span>
                  <span className="text-xs font-normal text-gray-500"> on </span>
                  <span className="text-xs font-normal text-gray-700">
                    {subscription?.items[0].price?.product?.name}
                  </span>
                </span>
                <ColoredChip
                  dense
                  text={subscription?.status}
                  color={{
                    incomplete: 'gray',
                    incomplete_expired: 'gray',
                    trialing: 'blue',
                    active: 'green',
                    past_due: 'orange',
                    canceled: 'gray',
                    unpaid: 'orange'
                  }}
                />
              </div>
            </SearchResult>
          );
        } catch {}
      }

      return results;
    },
    [stripe_account]
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  useClassName(document.documentElement, 'dark:bg-gray-900 dark:text-gray-300');
  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  const logoSrc = current_subdomain?.agency.theme.image_logo!.data;

  const search = useSearch();

  return (
    <div className="relative flex flex-col flex-1 w-full">
      <TopBar2>
        <AgencyLogo src={logoSrc} />
        <span className="md:hidden"></span>
        <Search search={search} />

        <span></span>
      </TopBar2>
      <Sidebar
        className="fixed inset-x-0 bottom-0 md:pt-16"
        links={sidebarLinks}
        bottomContent={<ApiLink />}
      />
      <div className="box-border flex flex-col flex-1 w-full pb-20 md:pb-0 md:pl-48 xl:pl-64">
        <div className="flex flex-col flex-1 px-2 py-4 sm:px-4">{children}</div>
      </div>
    </div>
  );
}
