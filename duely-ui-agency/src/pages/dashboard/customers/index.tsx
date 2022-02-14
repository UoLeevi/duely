import DashboardCustomersEditCustomer from './[customer_id]/edit';
import DashboardCustomersHome from './home';
import DashboardCustomersCreateCustomer from './new-customer';
import { RouteProps } from 'react-router-dom';
import { DashboardCustomersCustomer } from './[customer_id]';

export const routes: RouteProps[] = [
  {
    path: '/dashboard/customers/new-customer',
    component: DashboardCustomersCreateCustomer
  },
  {
    path: '/dashboard/customers/:customer_id/edit',
    component: DashboardCustomersEditCustomer
  },
  {
    path: '/dashboard/customers/:customer_id',
    component: DashboardCustomersCustomer
  },
  {
    path: '/dashboard/customers',
    component: DashboardCustomersHome
  }
];
