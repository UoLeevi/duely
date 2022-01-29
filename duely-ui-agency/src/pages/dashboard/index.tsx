import { Link, Route, RouteProps, Switch } from 'react-router-dom';
import { useQuery, current_agency_Q, current_user_Q, agency_stripe_account_Q } from '@duely/client';
import { LoadingScreen, ErrorScreen, Query } from '@duely/react';
import { DashboardLayout } from './components';
import { routes as customerRoutes } from './customers';
import { routes as siteRoutes } from './site';
import { routes as orderRoutes } from './orders';
import DashboardHome from './home';
import { routes as paymentsRoutes } from './payments';
import { routes as productsRoutes } from './products';
import { routes as settingsRoutes } from './settings';

const routes: RouteProps[] = [
  ...orderRoutes,
  ...productsRoutes,
  ...siteRoutes,
  ...customerRoutes,
  ...paymentsRoutes,
  ...settingsRoutes,
  {
    path: '/dashboard',
    component: DashboardHome
  }
];

const roles = ['agent', 'manager', 'owner'].map((r) => r.toUpperCase());

export default function Dashboard() {
  const { data: user, loading: userLoading, error: userError } = useQuery(current_user_Q);
  const {
    data: agency,
    loading: agencyLoading,
    error: agencyError,
    query: agencyQuery
  } = useQuery(current_agency_Q);
  const { query: stripeAccountQuery } = useQuery(
    agency_stripe_account_Q,
    (agency) => ({ agency_id: agency!.id }),
    { deps: [agencyQuery] }
  );

  const loading = userLoading || agencyLoading;
  const error = userError || agencyError;

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  const authorized = user?.memberships
    .filter((m) => roles.includes(m.access))
    .some((m) => m.subdomain.agency.id === agency?.id);

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex flex-col items-center m-3 space-y-1">
          <span className="font-medium text-gray-700 text">
            Seems like you are not allowed to access this page
          </span>
          <Link className="text-lg font-medium text-indigo-600" to="/">
            Go to home page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Query state={agencyQuery} queryKey={agencyQuery.queryDef}>
      <Query state={stripeAccountQuery} queryKey={stripeAccountQuery.queryDef}>
        <DashboardLayout>
          <Switch>
            {routes.map((route, i) => (
              <Route key={i} {...route} />
            ))}
          </Switch>
        </DashboardLayout>
      </Query>
    </Query>
  );
}
