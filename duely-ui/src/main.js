import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import subdomainRouter from './router/subdomainRouter';
import rootDomainRouter from './router/rootDomainRouter';
import '@/layouts';
import './registerServiceWorker';
import gql from 'graphql-tag';
import ApolloMixin from '@/mixins/ApolloMixin';
import ColorCalculatorMixin from '@/mixins/ColorCalculatorMixin';

Vue.config.productionTip = false;

Vue.mixin(ColorCalculatorMixin);

new Vue({
  vuetify,
  router: window.location.hostname.slice(-10).toLowerCase() === '.duely.app'
    ? subdomainRouter
    : rootDomainRouter,
  render: h => h(App),
  mixins: [ApolloMixin],
  data: {
    watchQuery: {
      query: gql`
        query {
          me {
            uuid
            name
            emailAddress
            type
          }
        }
      `
    }
  }
}).$mount('#app');
