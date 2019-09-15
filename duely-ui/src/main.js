import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import vutil from '@/plugins/vutil';
import App from '@/App.vue';
import subdomainRouter from '@/router/subdomainRouter';
import defaultRouter from '@/router/defaultRouter';
import '@/layouts';
import '@/registerServiceWorker';
import gql from 'graphql-tag';
import ApolloMixin from '@/mixins/ApolloMixin';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  vutil,
  router: window.location.hostname.slice(-10).toLowerCase() === '.duely.app'
    ? subdomainRouter
    : defaultRouter,
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
            agenciesConnection {
              edges {
                cursor
                roles
                node {
                  uuid
                  name
                  subdomain {
                    uuid
                    name
                  }
                }
              }
            }
          }
        }
      `
      //notifyOnNetworkStatusChange: true
    }
  }
}).$mount('#app');
