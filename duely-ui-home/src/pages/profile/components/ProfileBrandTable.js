import { query, useQuery, current_user_agencies_Q, agency_stripe_account_update_url_Q } from '@duely/client';
import { useDynamicNavigation, Table, LoadingScreen, ErrorScreen } from '@duely/react';
import { BsCheck, BsCreditCard, BsPeopleFill } from 'react-icons/bs';

const wrap = {
  columns: 1,
  spans: [
    1,
    1
  ]
};

const headers = [
  'Brand',
  'Action required'
];

function BrandColumn({ agency }) {
  const members = agency.subdomain.memberships
    .filter(m => m.access !== 'CLIENT')
    .map(m => m.user.name);

  const passAccessToken = useDynamicNavigation({ passAccessToken: true });

  return (
    <div className="flex items-center space-x-3">
      <img className="rounded-full h-16 w-16 sm:h-18 sm:w-18 object-contain" src={agency.theme.image_logo.data} alt={`${agency.name} logo`} />
      <a className="flex flex-col justify-center space-y-1" onClick={passAccessToken} href={`https://${agency.subdomain.name}.duely.app/dashboard`}>
        <div className="font-medium whitespace-nowrap">{agency.name}</div>
        <div className="flex space-x-2 text-gray-400 text-sm items-center">
          <BsPeopleFill className="text-gray-300" />
          <span className="text-xs font-medium">{members.join(', ')}</span>
        </div>
      </a>
    </div>
  );
}

function StatusColumn({ agency }) {
  const navigateToStripeAccountUpdate = useDynamicNavigation({ resolveUrl: async () => await query(agency_stripe_account_update_url_Q, { agency_id: agency.id }) });

  if (!agency.stripe_account.charges_enabled) {
    return (
      <div className="flex items-center space-x-5">
        <BsCreditCard className="block w-7 text-4xl text-indigo-500" />
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-gray-500">Update your information to enable charges</span>
          <a href="https://connect.stripe.com/setup/c/xxxxxxxxxxxx" onClick={navigateToStripeAccountUpdate} className="text-sm tracking-wide text-indigo-500 font-semibold">Continue to Stripe</a>
        </div>
      </div>
    );
  }

  if (!agency.stripe_account.payouts_enabled) {
    return (
      <div className="flex items-center space-x-5">
        <BsCreditCard className="block w-7 text-4xl text-indigo-500" />
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-gray-500">Update your information to enable payouts</span>
          <a href="https://connect.stripe.com/setup/c/xxxxxxxxxxxx" onClick={navigateToStripeAccountUpdate} className="text-sm tracking-wide text-indigo-500 font-semibold">Continue to Stripe</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-5">
      <BsCheck className="block w-7 text-4xl text-green-500" />
      <div className="flex flex-col space-y-1 items-center">
        <span className="text-sm font-medium text-gray-500">All set up.<br/>No actions required.</span>
      </div>
    </div>
  );
}

export function ProfileBrandTable() {
  const { data: agencies, loading, error } = useQuery(current_user_agencies_Q);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  const columns = [
    // Brand
    agency => <BrandColumn agency={agency} />,

    // Action required
    agency => <StatusColumn agency={agency} />
  ];

  return (
    <Table className="px-6 py-4" rows={agencies} columns={columns} headers={headers} wrap={wrap} />
  );
}
