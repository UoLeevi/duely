import DashboardPaymentsTransactions from './transactions';
import DashboardPaymentsInvoices from './invoices';
import { RouteProps } from 'react-router-dom';
import DashboardPaymentsCreateInvoice from './invoices/new-invoice';

export const routes: RouteProps[] = [
  {
    path: '/dashboard/payments/transactions',
    component: DashboardPaymentsTransactions
  },
  {
    path: '/dashboard/payments/invoices/new-invoice',
    component: DashboardPaymentsCreateInvoice
  },
  {
    path: '/dashboard/payments/invoices',
    component: DashboardPaymentsInvoices
  }
];
