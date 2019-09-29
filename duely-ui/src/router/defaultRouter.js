import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import SignUp from '@/views/SignUp.vue';
import Profile from '@/views/Profile.vue';
import ProfileHome from '@/views/ProfileHome.vue';
import ProfileSettings from '@/views/ProfileSettings.vue';
import ProfileAgencies from '@/views/ProfileAgencies.vue';
import ProfileCreateAgency from '@/views/ProfileCreateAgency.vue';

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
      beforeEnter(to) {
        location.href = process.env.NODE_ENV === 'production'
          ? `https://${to.query.subdomain}.duely.app/dashboard`
          : `${window.location.origin}/dashboard?subdomain=${to.query.subdomain}`;
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
        await router.app.$vgraph.ready;

        if (router.app.$vgraph.me.type === 'user')
          next();
        else
          next('?login');
      }
    }
  ]
})

export default router;
