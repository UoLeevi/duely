<template>
  <NarrowLayout backgroundColor="surface darken-2">
    <v-stepper v-model="step" vertical class="pa-5 elevation-24 rounded-corners">
      <v-stepper-step :complete="step > 1" step="1">
        Sign up for an account
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-form @submit.prevent="submitSignUpStep1" ref="signUpStep1Form" v-model="forms.signUpStep1.valid">
          <v-col class="pt-1">
            <v-text-field class="mt-0 mb-1" solo outlined flat single-line rounded v-model="data.emailAddress" :rules="rules.emailAddress" :readonly="verificationCodePrefilled" label="Email address" type="email" spellcheck="false" validate-on-blur />
            <v-text-field class="mt-1 mb-1" solo outlined flat single-line rounded v-model="data.name" :rules="rules.name" label="Full name" spellcheck="false" validate-on-blur />
            <v-text-field class="mt-1 mb-0" solo outlined flat single-line rounded v-model="data.password" :rules="rules.password" label="Password" type="password" spellcheck="false" autocomplete="new-password" />
            <div class="f-2 ml-2 mt-0 mb-3">
              By signing up, you agree to our <a href="javascript:;" @click.stop="tos = true">Services Agreement</a> and the <a target="_blank" href="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</a>.
            </div>
          </v-col>
          <v-expand-transition>
            <p class="error--text" v-if="forms.signUpStep1.errorMessage">{{ forms.signUpStep1.errorMessage }}</p>
          </v-expand-transition>
          <v-row class="ml-3 mt-1 mb-1" no-gutters>
            <v-btn depressed rounded :loading="forms.signUpStep1.loading" :disabled="!(forms.signUpStep1.valid)" type="submit" color="primary" class="text-none mr-4">Continue</v-btn>
            <v-btn text depressed rounded class="text-none" to="/">Cancel</v-btn>
          </v-row>
          <v-dialog v-model="tos" width="70%" content-class="rounded-corners">
            <v-card style="border-radius: 2rem;">
              <v-card-title class="title">Service Agreement</v-card-title>
              <v-card-text class="py-0">
                Payment processing services for agencies on duely are provided by Stripe and are subject to the <a target="_blank" href="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</a>, which includes the <a target="_blank" href="https://stripe.com/legal">Stripe Terms of Service</a> (collectively, the “Stripe Services Agreement”). By agreeing to this agreement or continuing to operate as a agency on duely, you agree to be bound by the Stripe Services Agreement, as the same may be modified by Stripe from time to time. As a condition of duely enabling payment processing services through Stripe, you agree to provide duely accurate and complete information about you and your business, and you authorize duely to share it and transaction information related to your use of the payment processing services provided by Stripe.
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text depressed rounded @click="tos = false">Ok</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-form>
      </v-stepper-content>

      <v-stepper-step :complete="step > 2" step="2">
        Verify your email address
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-form @submit.prevent="submitSignUpStep2" ref="signUpStep2Form" v-model="forms.signUpStep2.valid">
          <v-col class="pt-1 pb-1">
            <p class="text-xs-center">
              Please enter the 6-digit verification code that we sent to your email: <b>{{ data.emailAddress }}</b>
            </p>
            <v-text-field solo outlined flat single-line rounded v-model="data.verificationCode" :rules="rules.verificationCode" :readonly="verificationCodePrefilled" label="Verification code" counter="6" spellcheck="false"></v-text-field>
          </v-col>
          <v-expand-transition>
            <p class="error--text" v-if="forms.signUpStep2.errorMessage">{{ forms.signUpStep2.errorMessage }}</p>
          </v-expand-transition>
          <v-row class="ml-3 mt-1 mb-1" no-gutters>
            <v-btn depressed rounded :loading="forms.signUpStep2.loading" :disabled="!forms.signUpStep2.valid" type="submit" color="primary" class="text-none mr-4">Continue</v-btn>
            <v-btn text depressed rounded class="text-none" @click="step = 1">Back</v-btn>
          </v-row>
        </v-form>
      </v-stepper-content>

      <v-stepper-step :complete="step > 3" step="3">
        Get started
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-col class="pt-1 pb-1">
          <p class="text-xs-center">
            Your account is now created and you are now ready to start using duely.
          </p>
        </v-col>
        <v-row class="ml-3 mt-1 mb-4" no-gutters>
          <v-btn depressed rounded :loading="forms.logIn.loading" class="text-none mr-4" color="primary" @click="logIn">Log in and go to dashboard</v-btn>
          <v-btn depressed rounded text class="text-none" to="/">Cancel</v-btn>
        </v-row>
      </v-stepper-content>

    </v-stepper>
  </NarrowLayout>
</template>

<script>
import { gql } from '@/apollo';

export default {
  data() {
    return {
      inviteUuid: this.$route.query.invite !== undefined ? decodeURIComponent(this.$route.query.invite) : null,
      verificationCodePrefilled: this.$route.query.code !== undefined,
      step: 1,
      data: {
        emailAddress: this.$route.query.email !== undefined ? decodeURIComponent(this.$route.query.email) : '',
        name: this.$route.query.name !== undefined ? decodeURIComponent(this.$route.query.name) : '',
        password: '',
        verificationCode: this.$route.query.code !== undefined ? decodeURIComponent(this.$route.query.code) : '',
      },
      rules: {
        emailAddress: [
          v => !!v || 'Email address is required',
          v => /.+@.+\..+/.test(v) || 'Email address must be valid'
        ],
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 70) || 'Name must be at most 70 characters'
        ],
        password: [
          v => !!v || 'Password is required',
          v => v.length >= 6 || 'Min 6 characters'
        ],
        verificationCode: [
          v => /^\d{6}?$/.test(v) || 'Verification code has six digits'
        ]
      },
      forms: {
        signUpStep1: {
          errorMessage: null,
          loading: false,
          valid: false
        },
        signUpStep2: {
          errorMessage: null,
          loading: false,
          valid: false
        },
        logIn: {
          loading: false
        }
      },
      tos: false
    };
  },
  methods: {
    async submitSignUpStep1() {
      this.forms.signUpStep1.errorMessage = null;

      if (this.$refs.signUpStep1Form.validate()) {
        if (this.verificationCodePrefilled) {
          // Verification process already started
          this.step = 2;
          return;
        }

        this.forms.signUpStep1.loading = true;

        await this.$apollo.mutate({
          mutation: gql`mutation($emailAddress: String!) {
            startEmailAddressVerification(emailAddress: $emailAddress) {
              success
              message
            }
          }`,
          variables: {
            emailAddress: this.data.emailAddress
          },
          update: async (store, { data: { startEmailAddressVerification } }) => {
            if (startEmailAddressVerification.success)
              this.step = 2;
            else
              this.forms.signUpStep1.errorMessage = startEmailAddressVerification.message;

            this.forms.signUpStep1.loading = false;
          }
        });
      }
    },
    async submitSignUpStep2() {
      this.forms.signUpStep2.errorMessage = null;

      if (this.$refs.signUpStep2Form.validate()) {
        this.forms.signUpStep2.loading = true;

        await this.$apollo.mutate({
          mutation: gql`mutation($emailAddress: String!, $verificationCode: String!, $name: String!, $password: String!) {
            signUp(emailAddress: $emailAddress, verificationCode: $verificationCode, name: $name, password: $password) {
              success
              message
              userUuid
            }
          }`,
          variables: {
            emailAddress: this.data.emailAddress,
            verificationCode: this.data.verificationCode,
            name: this.data.name,
            password: this.data.password
          },
          update: async (store, { data: { signUp } }) => { 
            if (signUp.success)
              this.step = 3;
            else
              this.forms.signUpStep2.errorMessage = signUp.message;

            this.forms.signUpStep2.loading = false;
          }
        });
      }
    },
    async logIn() {
      this.forms.logIn.loading = true;

      await this.$apollo.mutate({
        mutation: gql`mutation($emailAddress: String!, $password: String!) {
          logIn(emailAddress: $emailAddress, password: $password) {
            success
            message
            jwt
          }
        }`,
        variables: {
          emailAddress: this.data.emailAddress,
          password: this.data.password
        },
        update: async (store, { data: { logIn } }) => {
        if (logIn.success)
          {
            const jwt = logIn.jwt;
            if (jwt) {
              localStorage.setItem('user-jwt', jwt);
              await this.$apollo.provider.defaultClient.clearStore();
            } else {
              this.$router.push({ path: '/' });
              this.forms.logIn.loading = false;
              return;
            }

          }
          else {
            this.errorMessage = logIn.message;
            this.forms.logIn.loading = false;
            return;
          }
        }
      });

      await this.$apollo.queries.me.refetch();

      if (!this.agency) {
        this.$router.push({ path: '/profile' });
        this.forms.logIn.loading = false;
        return;
      }

      // accept invite from the agency
      if (this.inviteUuid === null) {
        const invite = this.me.invitesConnection.edges.find(edge => edge.node.agency.uuid === this.agency.uuid && edge.node.status === null);

        if (!invite) {
          this.$router.push({ path: '/' });
          this.forms.logIn.loading = false;
          return;
        }

        this.inviteUuid = invite.uuid;
      }

      await this.$apollo.mutate({
        mutation: gql`mutation($inviteUuid: ID!) {
          acceptInvite(inviteUuid: $inviteUuid) {
            success
            message
            inviteUuid
          }
        }`,
        variables: {
          inviteUuid: this.inviteUuid
        },
        update: async ({ data: { acceptInvite } }) => {
        if (acceptInvite.success) {
            this.$router.push({ path: '/my-dashboard' });
            this.forms.logIn.loading = false;
            return;
          } else {
            // something went wrong
            console.log(acceptInvite.message);
            this.$router.push({ path: '/' });
            this.forms.logIn.loading = false;
            return;
          }
        }
      });
    }
  },
  apollo: {
    me: {
      query: gql`query {
        me {
          uuid
          name
          invitesConnection {
            cursor
            edges {
              node {
                uuid
                status
                agency {
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
      }`
    },
    session: {
      query: gql`query {
        session @client {
          subdomainName
        }
      }`
    },
    agency: {
      query: gql`query($subdomainName: String) {
        agency(subdomainName: $subdomainName) {
          uuid
          name
        }
      }`,
      variables () {
        return {
          subdomainName: this.session.subdomainName,
        }
      },
      skip () {
        return this.$apollo.queries.session.loading || this.session.subdomainName === null;
      }
    }
  },
  created() {
    this.removeQueryParameters('email', 'name', 'code', 'invite');
  }
};
</script>

