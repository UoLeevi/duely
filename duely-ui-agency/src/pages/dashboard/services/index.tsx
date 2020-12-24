import DashboardServicesEditService from './[service_url_name]/edit';
import DashboardServicesHome from './home';
import DashboardServicesCreateService from './new-service';

export const routes = [
  {
    path: '/dashboard/services/new-service',
    component: DashboardServicesCreateService
  },
  {
    path: '/dashboard/services/:service_url_name/edit',
    component: DashboardServicesEditService
  },
  {
    path: '/dashboard/services',
    component: DashboardServicesHome
  }
];
