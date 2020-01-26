import Vue from 'vue'
import Router from 'vue-router'
import AgencyHome from '@/views/AgencyHome.vue'
import Dashboard from '@/views/dashboard/Dashboard.vue'
import DashboardHome from '@/views/dashboard/DashboardHome.vue'
import DashboardPayments from '@/views/dashboard/DashboardPayments.vue'
import DashboardServices from '@/views/dashboard/DashboardServices.vue'
import DashboardServicesPanel from '@/views/dashboard/DashboardServicesPanel.vue'
import DashboardCompany from '@/views/dashboard/DashboardCompany.vue'
import DashboardSite from '@/views/dashboard/site/DashboardSite.vue'
import DashboardSiteHome from '@/views/dashboard/site/DashboardSiteHome.vue'
import DashboardSiteTheme from '@/views/dashboard/site/DashboardSiteTheme.vue'
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
        },
        {
          path: 'site',
          component: DashboardSite,
          children: [
            {
              path: '',
              component: DashboardSiteHome
            },
            {
              path: 'theme',
              component: DashboardSiteTheme
            }
          ]
        }
      ],
      async beforeEnter(to, from, next) {
        let res = await client.query({
          query: gql`query {
            me {
              uuid
              type
            }
          }`
        });

        if (res.data.me.type !== 'user') {
          next('?login');
          return
        }

        res = await client.query({
          query: gql`query {
            session @client {
              subdomainName
            }
          }`
        });

        if (res.data.session.subdomainName === null) {
          next(location.href = process.env.NODE_ENV === 'production'
            ? `https://duely.app`
            : `${window.location.origin}`);
          return;
        }

        const subdomainName = res.data.session.subdomainName;
        
        res = await client.query({
          query: gql`query($subdomainName: String) {
            agency(subdomainName: $subdomainName) {
              uuid
              name
            }
          }`,
          variables: {
            subdomainName
          }
        });

        if (res.data.agency.length !== 1) {
          next(location.href = process.env.NODE_ENV === 'production'
            ? `https://duely.app`
            : `${window.location.origin}`);
          return;
        }

        next();
      }
    }
  ]
});

export default router;
