import DashboardProductsEditProduct from './[product_url_name]/edit';
import DashboardProductsHome from './home';
import DashboardProductsCreateProduct from './new-product';

export const routes = [
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
