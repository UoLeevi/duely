<template>
  <v-app-bar fixed dark prominent short flat color="transparent" :style="{ 'color': textColor }">
    <v-row no-gutters align="center" justify="space-between" style="height: 100%;" >
      <v-col :cols="1" align="left"/>
      <v-col cols="auto" align="left"><h1 class="f-6 font-weight-regular pa-2">duely.app</h1></v-col>
      <v-col align="center"></v-col>
      <v-col cols="auto" align="right">
        <v-fade-transition mode="out-in">
          <v-progress-circular v-if="loading || $vgraph.loading || !$vgraph.me" indeterminate />
          <div v-else-if="$root.isLoggedIn" key="log-out">
            <v-btn @click="logOut" rounded text class="text-none mr-1" :color="textColor">Log out</v-btn>
            <v-btn to="/profile" rounded outlined class="text-none ml-1" :color="textColor">Go to profile</v-btn>
          </div>
          <div v-else key="log-in">
            <LoginDialog>
              <template #activator="{ on }">
                <v-btn v-on="on" large depressed rounded outlined class="text-none" :color="textColor">Log in</v-btn>
              </template>
            </LoginDialog>
          </div>
        </v-fade-transition>
      </v-col>
      <v-col :cols="1" align="right"/>
    </v-row>
  </v-app-bar>
</template>

<script>
import LoginDialog from '@/components/LoginDialog';
import ApolloMixin from '@/mixins/ApolloMixin';
import { client, gql } from '@/apollo';

export default {
  components: {
    LoginDialog
  },
  computed: {
    current() {
      return this.$vutil.scroll.current;
    },
    textColor() {
      return this.current && this.current.binding.value
        ? this.colorHex(this.current.binding.value.color) 
        : 'white';
    }
  },
  mixins: [ApolloMixin],
  methods: {
    async logOut() {
      this.loading = true;
      const res = await client.mutate({
        mutation: gql`
          mutation {
            logOut {
              success
              message
            }
          }
        `
      });

      if (!res.data.logOut.success) {
        //this.errorMessage = res.data.logIn.message;
        this.loading = false;
        return;
      }

      localStorage.removeItem('user-jwt');
      await client.clearStore();
      await client.query({
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
        });

      this.loading = false;
    }
  },
  data() {
    return {
      loading: false
    };
  }
};
</script>

<style>
  .v-app-bar,
  .v-app-bar .v-btn {
    transition: color 500ms ease !important;
  }
</style>