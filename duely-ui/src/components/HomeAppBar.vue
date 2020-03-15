<template>
  <v-app-bar fixed dark prominent short flat color="transparent" :style="{ 'color': textColor }">
    <v-row no-gutters align="center" justify="space-between" style="height: 100%;" >
      <v-col :cols="1" align="left"/>
      <v-col cols="auto" align="left">
        <template v-if="agency">
          <div class="d-flex">
            <img v-if="agency.theme && agency.theme.imageLogo" :src="agency.theme.imageLogo.data" style="max-width: 50px; max-height: 150px;" class="my-auto"/>
            <h1 class="f-5b font-weight-regular pa-2 text-no-wrap">{{ agency.name }}</h1>
          </div>
        </template>
        <h1 v-else class="f-6 font-weight-regular pa-2">duely</h1>
      </v-col>
      <v-col align="center"></v-col>
      <v-col cols="auto" align="right">
        <v-fade-transition mode="out-in">
          <v-progress-circular v-if="$apollo.queries.me.loading" indeterminate />
          <div v-else-if="me.type === 'user'" key="log-out">
            <v-btn @click="logOut" rounded text class="text-none mr-1" :color="textColor">Log out</v-btn>
            <template v-if="agency">
              <v-btn v-if="agencyRoles && agencyRoles.includes('agent')" to="/dashboard" rounded outlined class="text-none ml-1" :color="textColor">Go to dashboard</v-btn>
              <v-btn v-else to="/my-dashboard" rounded outlined class="text-none ml-1" :color="textColor">Go to my dashboard</v-btn>
            </template>
            <v-btn v-else to="/profile" rounded outlined class="text-none ml-1" :color="textColor">Go to profile</v-btn>
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
import { gql } from '@/apollo';

export default {
  components: {
    LoginDialog
  },
  props: {
    agency: Object /* {
      uuid
      name
      theme {
        uuid
        name
        imageLogo {
          uuid
          name
          data
          color
        }
      }
    }*/,
    agencyRoles: Array
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
  methods: {
    async logOut() {
      await this.$apollo.mutate({
        mutation: gql`mutation {
          logOut {
            success
            message
          }
        }`,
        update: async (store, { data: { logOut } }) => {
          if (logOut.success) {
            localStorage.removeItem('user-jwt');
          } else {
            /* eslint-disable */
            console.log(logOut.message);
            return;
          }
        }
      });

      await this.$apollo.provider.defaultClient.clearStore();
      await this.$apollo.queries.me.refetch();
    }
  },
  apollo : {
    me: gql`query {
      me {
        uuid
        type
      }
    }`
  }
};
</script>

<style>
  .v-app-bar,
  .v-app-bar .v-btn {
    transition: color 500ms ease !important;
  }
</style>
