import { RouteProps } from 'react-router-dom';
import DashboardPaymentsTransactions from './transactions';
import DashboardPaymentsInvoices from './invoices';
import DashboardPaymentsCreateInvoice from './invoices/new-invoice';
import DashboardPaymentsEditInvoice from './invoices/[invoice_id]/edit';
import { DashboardPaymentsInvoice } from './invoices/[invoice_id]';

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
    path: '/dashboard/payments/invoices/:invoice_id/edit',
    component: DashboardPaymentsEditInvoice
  },
  {
    path: '/dashboard/payments/invoices/:invoice_id',
    component: DashboardPaymentsInvoice
  },
  {
    path: '/dashboard/payments/invoices',
    component: DashboardPaymentsInvoices
  }
];
