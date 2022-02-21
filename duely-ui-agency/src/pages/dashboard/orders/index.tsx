import { RouteProps } from 'react-router-dom';
import DashboardOrdersHome from './home';
import { DashboardOrdersSubscriptions } from './subscriptions';
import { DashboardOrdersCreateSubscription } from './subscriptions/new-subscription';
import {
  DashboardOrdersEditSubscription,
  DashboardOrdersSubscription
} from './subscriptions/[subscription_id]';
import { DashboardOrdersOrder } from './[order_id]';

import DashboardOrdersEditOrder from './[order_id]/edit';

export const routes: RouteProps[] = [
  {
    path: '/dashboard/orders/subscriptions/new-subscription',
    component: DashboardOrdersCreateSubscription
  },
  {
    path: '/dashboard/orders/subscriptions/:subscription_id/edit',
    component: DashboardOrdersEditSubscription
  },
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
    path: '/dashboard/orders/:order_id',
    component: DashboardOrdersOrder
  },
  {
    path: '/dashboard/orders',
    component: DashboardOrdersHome
  }
];
