import DashboardProductsEditProduct from './[product_url_name]/edit';
import DashboardProductsHome from './home';
import DashboardProductsCreateProduct from './new-product';
import { RouteProps } from 'react-router-dom';
import DashboardProductsCoupons from './coupons';
import DashboardProductsCreateCoupon from './coupons/new-coupon';

export const routes: RouteProps[] = [
  {
    path: '/dashboard/products/new-product',
    component: DashboardProductsCreateProduct
  },
  {
    path: '/dashboard/products/coupons/new-coupon',
    component: DashboardProductsCreateCoupon
  },
  {
    path: '/dashboard/products/coupons',
    component: DashboardProductsCoupons
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
