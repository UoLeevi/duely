import { Link, Route, Switch } from 'react-router-dom';
import { useQuery, current_agency_Q, current_user_Q } from '@duely/client';
import { LoadingScreen, ErrorScreen } from '@duely/react';
import { DashboardLayout } from './components';
import DashboardClients from './clients';
import DashboardFiles from './files';
import DashboardHome from './home';
import DashboardPayments from './payments';
import DashboardProjects from './projects';
import { routes as serviceRoutes } from './services';
import DashboardSettings from './settings';

const routes = [
  {
    path: '/dashboard/projects',
    component: DashboardProjects
  },
  ...serviceRoutes,
  {
    path: '/dashboard/clients',
    component: DashboardClients
  },
  {
    path: '/dashboard/payments',
    component: DashboardPayments
  },
  {
    path: '/dashboard/files',
    component: DashboardFiles
  },
  {
    path: '/dashboard/settings',
    component: DashboardSettings
  },
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
    .filter(m => roles.some(r => r === m.access))
    .some(m => m.subdomain.agency.id === current_agency?.id);

  if (!authorized) {
    return (
      <div className="grid w-full h-full place-items-center">
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
