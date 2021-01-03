import { PageEditor } from 'components/PageEditor';
import DashboardSitePagesHome from './home';

export const routes = [
  {
    path: '/dashboard/site/pages/:page_id',
    component: PageEditor
  },
  {
    path: '/dashboard/site/pages',
    component: DashboardSitePagesHome
  }
];
