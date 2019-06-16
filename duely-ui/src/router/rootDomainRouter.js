import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import SignUp from '@/views/SignUp.vue';
import Dashboard from '@/views/Dashboard.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/create-account',
      name: 'create-account',
      component: SignUp
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    }
  ]
})
