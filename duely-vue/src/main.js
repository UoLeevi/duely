import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import subdomainRouter from './router/subdomainRouter';
import rootDomainRouter from './router/rootDomainRouter';
import '@/layouts';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router: window.location.hostname.slice(-10).toLowerCase() === '.duely.app'
    ? subdomainRouter
    : rootDomainRouter,
  render: h => h(App)
}).$mount('#app');
