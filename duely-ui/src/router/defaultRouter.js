import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import SignUp from '@/views/SignUp';
import Profile from '@/views/profile';
import ProfileHome from '@/views/profile/ProfileHome';
import ProfileSettings from '@/views/profile/ProfileSettings';
import ProfileAgencies from '@/views/profile/agencies';
import ProfileAgenciesHome from '@/views/profile/agencies/AgenciesHome';
import CreateAgency from '@/views/profile/agencies/CreateAgency';
import { client, gql } from '@/apollo';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/create-account',
      component: SignUp
    },
    {
      path: '/dashboard',
      beforeEnter(to, from, next) {
        const access_token = localStorage.getItem('user-jwt');

        if (access_token)
          location.href = process.env.NODE_ENV === 'production'
            ? `https://${to.query.subdomain}.duely.app/dashboard?access_token=${access_token}`
            : `${window.location.origin}/dashboard?subdomain=${to.query.subdomain}`;
        else
          next('/');
      }
    },
    {
      path: '/my-dashboard',
      beforeEnter(to, from, next) {
        const access_token = localStorage.getItem('user-jwt');

        if (access_token)
          location.href = process.env.NODE_ENV === 'production'
            ? `https://${to.query.subdomain}.duely.app/my-dashboard?access_token=${access_token}`
            : `${window.location.origin}/my-dashboard?subdomain=${to.query.subdomain}`;
        else
          next('/');
      }
    },
    {
      path: '/profile',
      component: Profile,
      children: [
        {
          path: '',
          component: ProfileHome
        },
        {
          path: 'settings',
          component: ProfileSettings
        },
        {
          path: 'agencies',
          component: ProfileAgencies,
          children: [
            {
              path: '',
              component: ProfileAgenciesHome
            },
            {
              path: 'create-agency',
              component: CreateAgency
            }
          ]
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
