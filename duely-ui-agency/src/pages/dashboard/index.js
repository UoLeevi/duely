import { Route, Switch } from 'react-router-dom';
import { useQuery, current_agency_Q } from '@duely/client';
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

export default function Dashboard() {
  const { loading, error, data: agency } = useQuery(current_agency_Q);

  if (loading) {
    return <span className="font-medium text-sm text-gray-700">Loading...</span>;
  }

  if (error) {
    console.error(error);
    return <span className="font-medium text-sm text-red-400">Error</span>;;
  }

  return (
    <DashboardLayout>
      <Switch>
        {routes.map((route, i) => <Route key={i} {...route} />)}
      </Switch>
    </DashboardLayout>
  );
}
