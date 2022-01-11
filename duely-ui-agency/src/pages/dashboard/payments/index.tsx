import { RouteProps } from 'react-router-dom';
import DashboardPaymentsTransactions from './transactions';
import DashboardPaymentsSubscriptions from './subscriptions';
import DashboardPaymentsCreateSubscription from './subscriptions/new-subscription';
import DashboardPaymentsEditSubscription from './subscriptions/[subscription_id]/edit';
import DashboardPaymentsInvoices from './invoices';
import DashboardPaymentsCreateInvoice from './invoices/new-invoice';
import DashboardPaymentsEditInvoice from './invoices/[invoice_id]/edit';

export const routes: RouteProps[] = [
  {
    path: '/dashboard/payments/transactions',
    component: DashboardPaymentsTransactions
  },
  {
    path: '/dashboard/payments/subscriptions/new-subscription',
    component: DashboardPaymentsCreateSubscription
  },
  {
    path: '/dashboard/payments/subscriptions/:subscription_id/edit',
    component: DashboardPaymentsEditSubscription
  },
  {
    path: '/dashboard/payments/subscriptions',
    component: DashboardPaymentsSubscriptions
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
    path: '/dashboard/payments/invoices',
    component: DashboardPaymentsInvoices
  }
];
