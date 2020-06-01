import Vue from 'vue';
import Router from 'vue-router';
import AgencyHome from '@/views/AgencyHome';
import SignUp from '@/views/SignUp';
import Dashboard from '@/views/dashboard';
import DashboardHome from '@/views/dashboard/DashboardHome';
import DashboardPayments from '@/views/dashboard/DashboardPayments';
import DashboardServices from '@/views/dashboard/services';
import DashboardServicesCreateService from '@/views/dashboard/services/DashboardServicesCreateService';
import DashboardServicesHome from '@/views/dashboard/services/DashboardServicesHome';
import DashboardServicesService from '@/views/dashboard/services/service';
import DashboardUsers from '@/views/dashboard/users';
import DashboardUsersHome from '@/views/dashboard/users/DashboardUsersHome';
import DashboardUsersClients from '@/views/dashboard/users/DashboardUsersClients';
import DashboardSite from '@/views/dashboard/site';
import DashboardSiteHome from '@/views/dashboard/site/DashboardSiteHome';
import DashboardSiteTheme from '@/views/dashboard/site/DashboardSiteTheme';
import Portal from '@/views/portal';
import PortalHome from '@/views/portal/PortalHome';
import PortalDocuments from '@/views/portal/PortalDocuments';
import PortalPayments from '@/views/portal/PortalPayments';
import PortalProjects from '@/views/portal/PortalProjects';
import PortalServices from '@/views/portal/services';
import PortalServicesHome from '@/views/portal/services/PortalServicesHome';
import PortalServicesService from '@/views/portal/services/service';
import { client, gql } from '@/apollo';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: AgencyHome,
      async beforeEnter(to, from, next) {
        let res = await client.query({
          query: gql`query {
            me {
              uuid
              type
            }
          }`
        });

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

        if (res.data.agency === null) {
          next(location.href = process.env.NODE_ENV === 'production'
            ? `https://duely.app`
            : `${window.location.origin}`);
          return;
        }

        next();
      }
    },
    {
      path: '/create-account',
      component: SignUp,
      async beforeEnter(to, from, next) {
        let res = await client.query({
          query: gql`query {
            me {
              uuid
              type
            }
          }`
        });

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

        if (res.data.agency === null) {
          next(location.href = process.env.NODE_ENV === 'production'
            ? `https://duely.app`
            : `${window.location.origin}`);
          return;
        }

        next();
      }
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
            default: DashboardServices
          },
          children: [
            {
              path: '',
              component: DashboardServicesHome
            },
            {
              path: 'create-service',
              component: DashboardServicesCreateService
            },
            {
              path: ':uuid',
              component: DashboardServicesService
            }
          ]
        },
        {
          path: 'users',
          component: DashboardUsers,
          children: [
            {
              path: '',
              component: DashboardUsersHome
            },
            {
              path: 'clients',
              component: DashboardUsersClients
            }
          ]
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

        const userUuid = res.data.me.uuid;

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
          query: gql`query($subdomainName: String, $subjectUuids: [ID!]) {
            agency(subdomainName: $subdomainName) {
              uuid
              name
              subjectsConnection {
                edges(uuids: $subjectUuids) {
                  roles
                }
              }
            }
          }`,
          variables: {
            subdomainName,
            subjectUuids: [userUuid]
          }
        });

        const agency = res.data.agency;

        if (agency === null || !agency.subjectsConnection.edges.some(edge => edge.roles.includes('agent'))) {
          next(location.href = process.env.NODE_ENV === 'production'
            ? `https://duely.app`
            : `${window.location.origin}`);
          return;
        }

        next();
      }
    },
    {
      path: '/portal',
      component: Portal,
      children: [
        {
          path: '',
          component: PortalHome
        },
        {
          path: 'projects',
          component: PortalProjects
        },
        {
          path: 'documents',
          component: PortalDocuments
        },
        {
          path: 'payments',
          component: PortalPayments
        },
        {
          path: 'services',
          components: {
            default: PortalServices
          },
          children: [
            {
              path: '',
              component: PortalServicesHome
            },
            {
              path: ':uuid',
              component: PortalServicesService
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

        const userUuid = res.data.me.uuid;

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
          query: gql`query($subdomainName: String, $subjectUuids: [ID!]) {
            agency(subdomainName: $subdomainName) {
              uuid
              name
              subjectsConnection {
                edges(uuids: $subjectUuids) {
                  roles
                }
              }
            }
          }`,
          variables: {
            subdomainName,
            subjectUuids: [userUuid]
          }
        });

        const agency = res.data.agency;

        if (agency === null || !agency.subjectsConnection.edges.some(edge => edge.roles.includes('client'))) {
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
