import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import SignUp from '@/views/SignUp.vue';
import Profile from '@/views/Profile.vue';
import ProfileHome from '@/views/ProfileHome.vue';
import ProfileSettings from '@/views/ProfileSettings.vue';
import ProfileAgencies from '@/views/ProfileAgencies.vue';
import ProfileCreateAgency from '@/views/ProfileCreateAgency.vue';
import { client, gql } from '@/apollo';

Vue.use(Router)

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
          component: ProfileAgencies
        },
        {
          path: 'create-agency',
          component: ProfileCreateAgency
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
})

export default router;
