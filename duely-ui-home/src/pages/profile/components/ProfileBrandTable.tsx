import {
  query,
  useQuery,
  current_user_agencies_Q,
  agency_stripe_account_update_url_Q
} from '@duely/client';
import {
  useDynamicNavigation,
  Table,
  LoadingScreen,
  ErrorScreen,
  SkeletonText,
  DropMenu,
  icons,
  Icon
} from '@duely/react';
import { ElementType } from '@duely/util';

type AgencyColumnProps = {
  agency:
    | (NonNullable<ReturnType<typeof current_user_agencies_Q.result>> extends readonly (infer T)[]
        ? T
        : never)
    | null;
};

function BrandColumn({ agency }: AgencyColumnProps) {
  if (!agency) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16 bg-gray-200 rounded-full sm:h-18 sm:w-18 animate-pulse" />
        <SkeletonText />
        <SkeletonText />
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <SkeletonText className="text-xs" />
        </div>
      </div>
    );
  }

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
  if (!agency) {
    return (
      <div className="flex items-center p-3 space-x-3 text-sm font-bold text-gray-600">
        <SkeletonText />
      </div>
    );
  }

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
      const url = await query(agency_stripe_account_update_url_Q, { agency_id: agency!.id });
      if (!url) throw new Error('Unable to get account update URL');
      return url;
    }
  });

  if (!agency) {
    return (
      <div className="flex items-center p-3 space-x-3 text-sm font-bold text-gray-600">
        <SkeletonText />
      </div>
    );
  }

  if (!agency.stripe_account.charges_enabled) {
    return (
      <div className="flex items-center space-x-5">
        <Icon name="credit-card" className="text-lg text-indigo-500" strokeWidth={1.75} />
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
        <Icon name="credit-card" className="text-lg text-indigo-500" strokeWidth={1.75} />
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

  if (agency.stripe_account.requirements.eventually_due.length > 0) {
    return (
      <div className="flex items-center space-x-5">
        <Icon name="credit-card" className="text-lg text-indigo-500" strokeWidth={1.75} />
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-gray-500">
            Update required information to keep your account enabled
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
      <Icon name="check" className="text-lg text-green-600" strokeWidth={1.75} />
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

function ActionsColumn({ agency }: AgencyColumnProps) {
  const navigateToStripeAccountUpdate = useDynamicNavigation({
    resolveUrl: async () => {
      const url = await query(agency_stripe_account_update_url_Q, { agency_id: agency!.id });
      if (!url) throw new Error('Unable to get account update URL');
      return url;
    }
  });

  if (!agency) {
    return <SkeletonText ch={5} />;
  }

  return (
    <DropMenu>
      <DropMenu.Item
        icon={icons.identification}
        href="https://connect.stripe.com/setup/c/xxxxxxxxxxxx"
        onClick={navigateToStripeAccountUpdate}
      >
        Update
      </DropMenu.Item>
    </DropMenu>
  );
}

export function ProfileBrandTable() {
  const { data: agencies, loading, error } = useQuery(current_user_agencies_Q);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  type TAgency = ElementType<typeof agencies>;

  return (
    <Table items={agencies as any} wrap={{ md: 4 }}>
      <Table.Column header="Brand" span={4}>
        {(agency: TAgency | null) => <BrandColumn agency={agency} />}
      </Table.Column>

      <Table.Column header="Plan">
        {(agency: TAgency | null) => <PlanColumn agency={agency} />}
      </Table.Column>

      <Table.Column header="Status" span={2}>
        {(agency: TAgency | null) => <StatusColumn agency={agency} />}
      </Table.Column>

      <Table.Column shrink>
        {(agency: TAgency | null) => <ActionsColumn agency={agency} />}
      </Table.Column>
    </Table>
  );
}
