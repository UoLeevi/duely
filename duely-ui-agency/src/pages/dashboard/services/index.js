import DashboardServicesHome from './home';
import DashboardServicesCreateService from './new-service';

export const routes = [
  {
    path: '/dashboard/services/new-service',
    component: DashboardServicesCreateService
  },
  {
    path: '/dashboard/services',
    component: DashboardServicesHome
  }
];
