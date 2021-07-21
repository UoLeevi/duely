import DashboardSettingsPaymentsHome from './home';
import DashboardSettingsPaymentsCreateBankAccount from './new-bank-account';
import { RouteProps } from 'react-router-dom';

export const routes: RouteProps[] = [
  {
    path: '/dashboard/settings/payments/new-bank-account',
    component: DashboardSettingsPaymentsCreateBankAccount
  },
  {
    path: '/dashboard/settings/payments',
    component: DashboardSettingsPaymentsHome
  }
];
