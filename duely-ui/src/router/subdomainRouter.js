import Vue from 'vue'
import Router from 'vue-router'
import AgencyHome from '@/views/AgencyHome.vue'
import Dashboard from '@/views/Dashboard.vue'
import DashboardHome from '@/views/DashboardHome.vue'
import DashboardPayments from '@/views/DashboardPayments.vue'
import DashboardServices from '@/views/DashboardServices.vue'
import DashboardServicesPanel from '@/views/DashboardServicesPanel.vue'
import DashboardCompany from '@/views/DashboardCompany.vue'
import { client, gql } from '@/apollo';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: AgencyHome
    },
    {
      path: '/profile',
      beforeEnter(to, from, next) {
        const access_token = localStorage.getItem('user-jwt');

        if (access_token)
          location.href = process.env.NODE_ENV === 'production'
            ? `https://duely.app/profile?access_token=${access_token}`
            : `${window.location.origin}/profile`;
        else
          next('/');
      }
    },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        {
          path: '',
          component: DashboardHome
        },
        {
          path: 'payments',
          component: DashboardPayments
        },
        {
          path: 'services',
          components: {
            default: DashboardServices,
            panel: DashboardServicesPanel
          }
        },
        {
          path: 'company',
          component: DashboardCompany
        }
      ],
      async beforeEnter(to, from, next) {
        const res = await client.query({
          query: gql`query {
            me {
              uuid
              type
            }
          }`
        });

        if (res.data.me.type === 'user')
          next();
        else
          next('?login');
      }
    }
  ]
});

export default router;
