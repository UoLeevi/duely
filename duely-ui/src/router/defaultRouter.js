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

export default new Router({
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
      ]
    }
  ]
})
