<template>
  <v-app-bar absolute dark shrink-on-scroll prominent flat color="transparent">
    <v-spacer v-show="$vuetify.breakpoint.smAndUp"/>
    <v-toolbar-title class="headline my-auto">
      <h3 class="logo-text">duely</h3>
    </v-toolbar-title>
    <v-spacer/>
    <template v-if="$vuetify.breakpoint.smAndUp">
      <v-tabs optional align-with-title>
        <v-tab class="text-none subtitle-1">Features</v-tab>
        <v-tab class="text-none subtitle-1">Pricing</v-tab>
        <v-tab class="text-none subtitle-1">Examples</v-tab>
      </v-tabs>
      <v-spacer/>
      <v-spacer/>
      <div class="my-auto">
        <v-fade-transition mode="out-in">
          <v-progress-circular v-if="loading" indeterminate />
          <div v-else-if="graph.me" key="log-out">
            <v-btn @click="logOut" rounded text class="text-none mx-1">Log out</v-btn>
            <v-btn rounded outlined class="text-none mx-1">Go to dashboard</v-btn>
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
      <v-spacer/>
    </template>
    <template v-else>
      <div class="my-auto">
        <v-menu
          v-model="menu"
          full-width>
          <template v-slot:activator="{ on }">
            <v-btn text icon large color="white" v-on="on">
              <v-icon>menu</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item class="text-none subtitle-1">Features</v-list-item>
              <v-list-item class="text-none subtitle-1">Pricing</v-list-item>
              <v-list-item class="text-none subtitle-1">Examples</v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </template>
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
      localStorage.removeItem('jwt');
      await client.clearStore();
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
