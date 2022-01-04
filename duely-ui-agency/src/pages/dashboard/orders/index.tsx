import { RouteProps } from 'react-router-dom';
import DashboardOrdersHome from './home';
import DashboardOrdersSubscriptions from './subscriptions';
import DashboardOrdersSubscription from './subscriptions/[subscription_id]';

import DashboardOrdersEditOrder from './[order_id]/edit';

export const routes: RouteProps[] = [
  {
    path: '/dashboard/orders/subscriptions/:subscription_id',
    component: DashboardOrdersSubscription
  },
  {
    path: '/dashboard/orders/subscriptions',
    component: DashboardOrdersSubscriptions
  },
  {
    path: '/dashboard/orders/:order_id/edit',
    component: DashboardOrdersEditOrder
  },
  {
    path: '/dashboard/orders',
    component: DashboardOrdersHome
  }
];
