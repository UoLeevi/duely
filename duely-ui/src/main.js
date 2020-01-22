import Vue from 'vue';
import apolloProvider from '@/plugins/vueApollo';
//import vgraph from '@/plugins/vgraph';
import vuetify from '@/plugins/vuetify';
import vutil from '@/plugins/vutil';
import App from '@/App.vue';
import subdomainRouter from '@/router/subdomainRouter';
import defaultRouter from '@/router/defaultRouter';
import '@/layouts';
import '@/registerServiceWorker';

Vue.config.productionTip = false;
let router;

if (process.env.NODE_ENV === 'production') {
  router = window.location.hostname.slice(-10).toLowerCase() === '.duely.app'
    ? subdomainRouter
    : defaultRouter;
} else {
  const queryParams = new URLSearchParams(window.location.search);
  router = queryParams.has('subdomain')
    ? subdomainRouter
    : defaultRouter;
}

new Vue({
  apolloProvider,
  //vgraph,
  vuetify,
  vutil,
  router,
  render: h => h(App),
  // computed: {
  //   isLoggedIn() {
  //     return this.$vgraph.me && this.$vgraph.me.type === 'user';
  //   }
  // }
}).$mount('#app');
