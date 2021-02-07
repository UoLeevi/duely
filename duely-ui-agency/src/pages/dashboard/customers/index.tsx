import DashboardCustomersEditCustomer from './[customer_id]/edit';
import DashboardCustomersHome from './home';
import DashboardCustomersCreateCustomer from './new-customer';

export const routes = [
  {
    path: '/dashboard/customers/new-customer',
    component: DashboardCustomersCreateCustomer
  },
  {
    path: '/dashboard/customers/:customer_id/edit',
    component: DashboardCustomersEditCustomer
  },
  {
    path: '/dashboard/customers',
    component: DashboardCustomersHome
  }
];
