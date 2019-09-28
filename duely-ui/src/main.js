import Vue from 'vue';
import vgraph from '@/plugins/vgraph';
import vuetify from '@/plugins/vuetify';
import vutil from '@/plugins/vutil';
import App from '@/App.vue';
import subdomainRouter from '@/router/subdomainRouter';
import defaultRouter from '@/router/defaultRouter';
import '@/layouts';
import '@/registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  vgraph,
  vuetify,
  vutil,
  router: window.location.hostname.slice(-10).toLowerCase() === '.duely.app'
    ? subdomainRouter
    : defaultRouter,
  render: h => h(App),
  computed: {
    isLoggedIn() {
      return this.$vgraph.me && this.$vgraph.me.type === 'user';
    }
  }
}).$mount('#app');
