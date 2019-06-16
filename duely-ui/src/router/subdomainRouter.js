import Vue from 'vue'
import Router from 'vue-router'
import SellerHome from '@/views/SellerHome.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'seller-home',
      component: SellerHome
    }
  ]
})
