import DashboardProductsEditProduct from './[product_url_name]/edit';
import DashboardProductsHome from './home';
import DashboardProductsCreateProduct from './new-product';
import { RouteProps } from 'react-router-dom';

export const routes: RouteProps[] = [
  {
    path: '/dashboard/products/new-product',
    component: DashboardProductsCreateProduct
  },
  {
    path: '/dashboard/products/:product_url_name/edit',
    component: DashboardProductsEditProduct
  },
  {
    path: '/dashboard/products',
    component: DashboardProductsHome
  }
];
