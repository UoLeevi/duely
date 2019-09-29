import Vue from 'vue'
import Router from 'vue-router'
import AgencyHome from '@/views/AgencyHome.vue'
import Dashboard from '@/views/Dashboard.vue'
import DashboardHome from '@/views/DashboardHome.vue'
import DashboardUsers from '@/views/DashboardUsers.vue'

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
      beforeEnter() {
        location.href = process.env.NODE_ENV === 'production'
          ? 'https://duely.app/profile'
          : `${window.location.origin}/profile`;
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
          path: 'users',
          component: DashboardUsers
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
});

export default router;
