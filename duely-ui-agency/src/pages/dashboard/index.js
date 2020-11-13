import DashboardLayout from 'components/DashboardLayout';
import { Route, Switch } from 'react-router-dom';
import DashboardClients from './clients';
import DashboardFiles from './files';
import DashboardHome from './home';
import DashboardPayments from './payments';
import DashboardProjects from './projects';
import DashboardServices from './services';
import DashboardSettings from './settings';

const routes = [
  {
    path: '/dashboard/projects',
    component: DashboardProjects
  },
  {
    path: '/dashboard/services',
    component: DashboardServices
  },
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
  return (
    <DashboardLayout>
      <Switch>
        {routes.map((route, i) => <Route key={i} {...route} />)}
      </Switch>
    </DashboardLayout>
  );
}
