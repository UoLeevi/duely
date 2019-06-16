<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template #activator="activator">
      <slot name="activator" v-bind="activator">
        <v-btn flat color="grey darken-1" v-on="activator.on">
          <span>Log In</span>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title><h2>Log In</h2></v-card-title>
      <v-card-text>
      <v-form class="px-3 py-2" @submit.prevent="submit" ref="form">
        <v-text-field label="Email" 
          :rules="[rules.required, rules.emailFormat]"
          type="email" 
          v-model="email" 
          validate-on-blur
          spellcheck="false"/>
        <v-text-field label="Password" 
          :append-icon="isPasswordVisible ? 'visibility' : 'visibility_off'" 
          :type="isPasswordVisible ? 'text' : 'password'" 
          :rules="[rules.required, rules.minLength]"
          v-model="password" 
          validate-on-blur
          spellcheck="false"
          @click:append="isPasswordVisible = !isPasswordVisible"/>
        <v-btn class="primary mt-4" type="submit" :loading="processing">
          <span>Log In</span>
        </v-btn>
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
      email: '',
      password: '',
      isPasswordVisible: false,
      rules: {
        required: v => !!v || 'Required',
        minLength: v => v.length >= 6 || 'Min 6 characters',
        emailFormat: v => /^\S+@\S+$/.test(v) || 'Email address does not have correct format'
      },
      processing: false
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate())
      {
        this.processing = true
        const res = await client.mutate({
          mutation: gql`
            mutation($email: String!, $password: String!) {
              logIn(email: $email, password: $password) {
                uuid
                jwt
                account {
                  uuid
                  email
                }
              }
            }
          `,
          variables: {
            email: this.email,
            password: this.password
          }
        });
        const jwt = res.data.logIn.jwt;
        if (jwt) {
          localStorage.setItem('jwt', jwt);
          await client.clearStore();
          await client.query({
            query: gql`
              query {
                me {
                  uuid
                  email
                }
              }`
          });
        }

        this.dialog = false;
        this.processing = false;
      }
    }
  }
}
</script>

<style>

</style>
