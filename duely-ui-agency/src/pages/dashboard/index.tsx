import { Link, Route, RouteProps, Switch } from 'react-router-dom';
import { useQuery, current_agency_Q, current_user_Q } from '@duely/client';
import { LoadingScreen, ErrorScreen } from '@duely/react';
import { DashboardLayout } from './components';
import { routes as customerRoutes } from './customers';
import { routes as siteRoutes } from './site';
import { routes as orderRoutes } from './orders';
import DashboardHome from './home';
import DashboardPayments from './payments';
import { routes as productRoutes } from './products';
import { routes as settingsRoutes } from './settings';

const routes: RouteProps[] = [
  ...orderRoutes,
  ...productRoutes,
  ...siteRoutes,
  ...customerRoutes,
  {
    path: '/dashboard/payments',
    component: DashboardPayments
  },
  ...settingsRoutes,
  {
    path: '/dashboard',
    component: DashboardHome
  }
];

const roles = ['agent', 'manager', 'owner'].map(r => r.toUpperCase());

export default function Dashboard() {
  const { data: current_user } = useQuery(current_user_Q);
  const { data: current_agency, loading, error } = useQuery(current_agency_Q);

  if (loading) return <LoadingScreen />
  if (error) return <ErrorScreen />

  const authorized = current_user?.memberships
    .filter(m => roles.includes(m.access))
    .some(m => m.subdomain.agency.id === current_agency?.id);

  if (!authorized) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex flex-col items-center m-3 space-y-1">
          <span className="font-medium text-gray-700 text">Seems like you are not allowed to access this page</span>
          <Link className="text-lg font-medium text-indigo-600" to="/">Go to home page</Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Switch>
        {routes.map((route, i) => <Route key={i} {...route} />)}
      </Switch>
    </DashboardLayout>
  );
}
