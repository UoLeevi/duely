import {
  query,
  useQuery,
  current_user_agencies_Q,
  agency_stripe_account_update_url_Q
} from '@duely/client';
import { useDynamicNavigation, Table, LoadingScreen, ErrorScreen } from '@duely/react';

type AgencyColumnProps = {
  agency: NonNullable<
    ReturnType<typeof current_user_agencies_Q.result>
  > extends readonly (infer T)[]
    ? T
    : never;
};

const wrap = {
  columns: 1,
  spans: [1, 1, 1]
};

const headers = ['Brand', 'Plan', 'Action required'];

function BrandColumn({ agency }: AgencyColumnProps) {
  const members = agency.subdomain.memberships
    .filter((m) => m.access !== 'CLIENT')
    .map((m) => m.user.name);

  const passAccessToken = useDynamicNavigation({ passAccessToken: true });

  return (
    <div className="flex items-center space-x-3">
      <img
        className="object-contain w-16 h-16 rounded-full sm:h-18 sm:w-18"
        src={agency.theme.image_logo!.data}
        alt={`${agency.name} logo`}
      />
      <a
        className="flex flex-col justify-center space-y-1"
        onClick={passAccessToken}
        href={`https://${agency.subdomain.name}.duely.app/dashboard`}
      >
        <div className="font-medium whitespace-nowrap">{agency.name}</div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span className="text-xs font-medium">{members.join(', ')}</span>
        </div>
      </a>
    </div>
  );
}

function PlanColumn({ agency }: AgencyColumnProps) {
  const plan = agency.subscription_plan;

  return (
    <div className="flex items-center p-3 space-x-3 text-sm font-bold text-gray-600">
      {plan.name}
    </div>
  );
}

function StatusColumn({ agency }: AgencyColumnProps) {
  const navigateToStripeAccountUpdate = useDynamicNavigation({
    resolveUrl: async () => {
      const url = await query(agency_stripe_account_update_url_Q, { agency_id: agency.id });
      if (!url) throw new Error('Unable to get account update URL');
      return url;
    }
  });

  if (!agency.stripe_account.charges_enabled) {
    return (
      <div className="flex items-center space-x-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="block w-6 h-6 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-gray-500">
            Update your information to enable charges
          </span>
          <a
            href="https://connect.stripe.com/setup/c/xxxxxxxxxxxx"
            onClick={navigateToStripeAccountUpdate}
            className="text-sm font-semibold tracking-wide text-indigo-500"
          >
            Continue to Stripe
          </a>
        </div>
      </div>
    );
  }

  if (!agency.stripe_account.payouts_enabled) {
    return (
      <div className="flex items-center space-x-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="block w-6 h-6 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-gray-500">
            Update your information to enable payouts
          </span>
          <a
            href="https://connect.stripe.com/setup/c/xxxxxxxxxxxx"
            onClick={navigateToStripeAccountUpdate}
            className="text-sm font-semibold tracking-wide text-indigo-500"
          >
            Continue to Stripe
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 blocktext-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <div className="flex flex-col items-center space-y-1">
        <span className="text-sm font-medium text-gray-500">
          All set up.
          <br />
          No actions required.
        </span>
      </div>
    </div>
  );
}

export function ProfileBrandTable() {
  const { data: agencies, loading, error } = useQuery(current_user_agencies_Q);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  type TAgency = NonNullable<typeof agencies> extends readonly (infer T)[] ? T : never;

  const columns = [
    // Brand
    (agency: TAgency) => <BrandColumn agency={agency} />,

    // Plan
    (agency: TAgency) => <PlanColumn agency={agency} />,

    // Action required
    (agency: TAgency) => <StatusColumn agency={agency} />
  ];

  return <Table items={agencies} columns={columns} headers={headers} wrap={wrap} />;
}
