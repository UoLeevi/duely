import { Link, Route, Switch } from 'react-router-dom';
import { useQuery, current_agency_Q, current_user_Q } from '@duely/client';
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

  if (loading) {
    return <span className="font-medium text-sm text-gray-700">Loading...</span>;
  }

  if (error) {
    console.error(error);
    return <span className="font-medium text-sm text-red-400">Error</span>;;
  }

  const authorized = current_user?.memberships
    .filter(m => roles.some(r => r === m.access))
    .some(m => m.subdomain.agency.id === current_agency.id);

  if (!authorized) {
    return (
      <div className="grid h-full w-full place-items-center">
        <div className="flex flex-col m-3 space-y-1 items-center">
          <span className="font-medium text text-gray-700">Seems like you are not allowed to access this page</span>
          <Link className="font-medium text-lg text-indigo-600" to="/">Go to home page</Link>
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
