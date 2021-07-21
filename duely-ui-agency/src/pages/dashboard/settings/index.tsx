import { RouteProps } from 'react-router-dom';
import DashboardSettingsCheckout from './checkout';
import DashboardSettingsIntegrations from './integrations';
import DashboardSettingsMiscellaneous from './miscellaneous';
import { routes as paymentSettingsRoutes } from './payments';

export const routes: RouteProps[] = [
  ...paymentSettingsRoutes,
  {
    path: '/dashboard/settings/checkout',
    component: DashboardSettingsCheckout
  },
  {
    path: '/dashboard/settings/integrations',
    component: DashboardSettingsIntegrations
  },
  {
    path: '/dashboard/settings/miscellaneous',
    component: DashboardSettingsMiscellaneous
  }
];
