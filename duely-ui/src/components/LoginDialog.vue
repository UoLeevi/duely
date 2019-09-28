<template>
  <v-dialog content-class="rounded-corners" max-width="600px" v-model="dialog" @click:outside="$refs.form.reset()">
    <template #activator="activator">
      <slot name="activator" v-bind="activator">
        <v-btn v-on="activator.on">
          <span>Log in</span>
        </v-btn>
      </slot>
    </template>
    <v-card flat class="pa-5 rounded-corners">
      <v-card-title>
        <h2 class="display-1">Log in</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="pb-1 px-4" @submit.prevent="submit" ref="form">
          <v-text-field color="primary" solo outlined flat single-line rounded class="mt-5 mb-1" label="Email address" :rules="[rules.required, rules.emailAddressFormat]" type="email" v-model="emailAddress" validate-on-blur spellcheck="false" />
          <v-text-field color="primary" solo outlined flat single-line rounded class="mt-1 mb-1" label="Password" :append-icon="isPasswordVisible ? 'visibility' : 'visibility_off'" :type="isPasswordVisible ? 'text' : 'password'" :rules="[rules.required, rules.minLength]" v-model="password" validate-on-blur spellcheck="false" @click:append="isPasswordVisible = !isPasswordVisible" />
          <v-expand-transition>
            <p class="error--text" v-if="errorMessage">{{ errorMessage }}</p>
          </v-expand-transition>
          <v-row no-gutters align="center" justify="center">
            <v-btn depressed rounded color="primary" x-large class="body-1 text-none" type="submit" :loading="loading">Log in</v-btn>
            <v-spacer />
            <span>Don't have an account?</span>
            <v-btn text depressed rounded small color="primary" class="body-2 ml-1 text-none" :to="emailAddress ? `/create-account?email=${emailAddress}` : '/create-account'">Sign up</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { client, gql } from '@/apollo';

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
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const res = await client.mutate({
          mutation: gql`
            mutation($emailAddress: String!, $password: String!) {
              logIn(emailAddress: $emailAddress, password: $password) {
                success
                message
                jwt
              }
            }
          `,
          variables: {
            emailAddress: this.emailAddress,
            password: this.password
          }
        });

        if (!res.data.logIn.success) {
          this.errorMessage = res.data.logIn.message;
          this.loading = false;
          return;
        }

        const jwt = res.data.logIn.jwt;
        if (jwt) {
          localStorage.setItem('user-jwt', jwt);
          await client.clearStore();
          this.$router.push({ path: '/profile' });
        }

        this.dialog = false;
        this.loading = false;
      }
    }
  }
};
</script>
