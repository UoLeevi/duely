<template>
  <v-app>
    <SplashScreenLoader :show="initializing || loading" />
    <v-content>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script>
import SplashScreenLoader from '@/components/SplashScreenLoader';
import ApolloMixin from '@/mixins/ApolloMixin';

import { client, gql } from '@/apollo';

export default {
  name: 'App',
  mixins: [ApolloMixin],
  components: {
    SplashScreenLoader
  },
  computed: {
    layout () {
      return this.$store.getters.layout
    }
  },
  data() {
    return {
      initializing: true,
      watchQuery: {
        query: gql`
          query {
            me {
              uuid
              email
            }
          }
        `
      }
    };
  },
  async created() {
    if (window.location.hostname.slice(-10).toLowerCase() === '.duely.app') {
      const res = await client.query({
        query: gql`
          query($host: String!) {
            subdomain(host: $host) {
              uuid
              host
              seller {
                uuid
                name
              }
              theme {
                uuid
                name
                colorPrimary
                colorSecondary
                colorAccent
                colorError
                colorInfo
                colorSuccess
                colorWarning
              }
            }
          }
        `,
        variables: {
          host: window.location.hostname.slice(0, -10).toLowerCase()
        }
      });

      if (!res.data.subdomain) {
        window.location.replace("https://duely.app");
        return;
      }

      const theme = res.data.subdomain.theme;

      this.$vuetify.theme.primary = theme.colorPrimary;
      this.$vuetify.theme.secondary = theme.colorSecondary;
      this.$vuetify.theme.accent = theme.colorAccent;
      this.$vuetify.theme.error = theme.colorError;
      this.$vuetify.theme.info = theme.colorInfo;
      this.$vuetify.theme.success = theme.colorSuccess;
      this.$vuetify.theme.warning = theme.colorWarning;
    }

    this.initializing = false;
  }
}
</script>
