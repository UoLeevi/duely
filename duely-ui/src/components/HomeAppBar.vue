<template>
  <v-app-bar absolute dark shrink-on-scroll prominent flat color="transparent">
    <v-layout fill-height align-center justify-center>
      <v-flex xs12 sm11 md10 lg9 xl7>
        <v-layout fill-height align-center justify-center>
          <v-flex xs4 sm3 lg4>
            <v-layout justify-start class="pl-4">
              <v-toolbar-title class="headline my-auto">
                <h3 class="logo-text">duely</h3>
              </v-toolbar-title>
            </v-layout>
          </v-flex>
          <v-flex v-if="$vuetify.breakpoint.mdAndUp">
            <v-layout justify-center>
              <v-tabs optional>
                <v-tab class="text-none subtitle-1">Features</v-tab>
                <v-tab class="text-none subtitle-1">Pricing</v-tab>
                <v-tab class="text-none subtitle-1">Examples</v-tab>
              </v-tabs>
            </v-layout>
          </v-flex>
          <v-flex md5>
            <v-layout justify-end class="pr-4">
              <div class="my-auto">
                <v-fade-transition mode="out-in">
                  <v-progress-circular v-if="loading" indeterminate />
                  <div v-else-if="graph.me" key="log-out">
                    <v-btn @click="logOut" rounded text class="text-none mx-1">Log out</v-btn>
                    <v-btn to="/dashboard" rounded outlined class="text-none mx-1">Go to dashboard</v-btn>
                  </div>
                  <div v-else key="log-in">
                    <LoginDialog>
                      <template #activator="{ on }">
                        <v-btn v-on="on" rounded text class="text-none mx-1">Log in</v-btn>
                      </template>
                    </LoginDialog>
                    <v-btn to="/create-account"
                      rounded outlined class="text-none mx-1">Sign up</v-btn>
                  </div>
                </v-fade-transition>
              </div>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-app-bar>
</template>

<script>
import LoginDialog from '@/components/LoginDialog';
import ApolloMixin from '@/mixins/ApolloMixin';

import { gql, client } from '@/apollo';

export default {
  components: {
    LoginDialog
  },
  mixins: [ApolloMixin],
  methods: {
    async logOut() {
      this.loading = true;
      localStorage.removeItem('jwt');
      await client.clearStore();
      this.loading = false;
    }
  },
  data() {
    return {
      menu: false,
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
  }
}
</script>
