<template>
  <v-dialog content-class="rounded-corners" max-width="600px" v-model="dialog" @click:outside="$refs.form.reset()">
    <template #activator="activator">
      <slot name="activator" v-bind="activator">
        <v-btn v-on="activator.on">
          <span>Log in</span>
        </v-btn>
      </slot>
    </template>
    <v-card flat class="pa-4 rounded-corners">
      <v-card-title>
        <h2 class="f-6b text-no-wrap">Log in</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="pb-1 px-4" @submit.prevent="logIn" ref="form">
          <v-text-field color="primary" solo outlined flat single-line rounded class="mt-5 mb-1" label="Email address" :rules="[rules.required, rules.emailAddressFormat]" type="email" v-model="emailAddress" validate-on-blur spellcheck="false" />
          <v-text-field color="primary" solo outlined flat single-line rounded class="mt-1 mb-1" label="Password" :append-icon="isPasswordVisible ? 'visibility' : 'visibility_off'" :type="isPasswordVisible ? 'text' : 'password'" :rules="[rules.required, rules.minLength]" v-model="password" validate-on-blur spellcheck="false" @click:append="isPasswordVisible = !isPasswordVisible" />
          <v-expand-transition>
            <p class="error--text" v-if="errorMessage">{{ errorMessage }}</p>
          </v-expand-transition>
          <v-row no-gutters class="flex-wrap justify-space-around align-center ma-n3 mb-n4">
            <v-btn depressed rounded min-width="140px" color="primary" x-large class="f-3b ma-3 text-none" type="submit" :loading="$apollo.loading">Log in</v-btn>
            <div class="d-inline-flex ma-2 align-center">
              <span class="text-no-wrap f-2 text-none">Don't have an account?</span>
              <v-btn text depressed rounded small color="primary" class="f-2b text-none" :to="emailAddress ? `/create-account?email=${emailAddress}` : '/create-account'">Sign up</v-btn>
            </div>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { gql } from '@/apollo';

export default {
  data() {
    return {
      dialog: false,
      emailAddress: decodeURIComponent(this.$route.query.login || ''),
      password: '',
      isPasswordVisible: false,
      rules: {
        required: v => !!v || 'Required',
        minLength: v => (v || '').length >= 6 || 'Min 6 characters',
        emailAddressFormat: v =>
          /^\S+@\S+$/.test(v) || 'Email address does not have correct format'
      },
      errorMessage: null,
      loading: false
    };
  },
  async created() {
    await this.$nextTick();
    this.dialog = this.$route.query.login !== undefined
    this.removeQueryParameters('login');
  },
  methods: {
    async logIn() {
      await this.$apollo.mutate({
        mutation: gql`mutation($emailAddress: String!, $password: String!) {
          logIn(emailAddress: $emailAddress, password: $password) {
            success
            message
            jwt
          }
        }`,
        variables: {
          emailAddress: this.emailAddress,
          password: this.password
        },
        update: async (store, { data: { logIn } }) => {
          if (logIn.success)
          {
            const jwt = logIn.jwt;
            if (jwt) {
              localStorage.setItem('user-jwt', jwt);
              await this.$apollo.provider.defaultClient.clearStore();
              //await this.$apollo.queries.me.refetch();
              this.$router.push({ path: '/profile' });
            }

            this.dialog = false;
          }
          else
            /* eslint-disable */
            console.log(logIn.message);
        }
      });
    }
  }
};
</script>
