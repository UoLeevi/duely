<template>
  <NarrowLayout>
    <v-stepper v-model="step" vertical class="mt-4">
      <v-stepper-step :complete="step > 1" step="1">
        Sign up for an account
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-form @submit.prevent="submitSignUpStep1" ref="signUpStep1Form" v-model="forms.signUpStep1.valid" >
          <v-layout wrap class="my-2">
            <v-flex xs12>
              <v-text-field outlined v-model="data.email" :rules="rules.email" label="Email address" type="email" spellcheck="false" validate-on-blur></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field outlined v-model="data.name" :rules="rules.name" label="Full name" spellcheck="false" validate-on-blur></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field outlined v-model="data.password" :rules="rules.password" label="Password" type="password" spellcheck="false" autocomplete="new-password" validate-on-blur></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-checkbox v-model="data.acceptTermsAndConditions" off-icon="check_box_outline_blank" on-icon="check_box" color="secondary" class="ml-3 my-0">
                <template #label>
                  <div @click.stop="">
                    Do you accept the
                    <a href="javascript:;" @click.stop="terms = true">terms</a>
                    and
                    <a href="javascript:;" @click.stop="conditions = true">conditions</a><span>?</span>
                  </div>
                </template>
              </v-checkbox>
            </v-flex>
          </v-layout>
          <v-expand-transition>
            <p class="error--text" v-if="forms.signUpStep1.errorMessage">{{ forms.signUpStep1.errorMessage }}</p>
          </v-expand-transition>
          <v-btn :loading="forms.signUpStep1.loading" :disabled="!(forms.signUpStep1.valid && data.acceptTermsAndConditions)" type="submit" color="primary" class="text-none mr-1">Continue</v-btn>
          <v-btn text class="text-none" to="/">Cancel</v-btn>
          <v-dialog v-model="terms" width="70%">
            <v-card>
              <v-card-title class="title">Terms</v-card-title>
              <v-card-text>
                Terms... Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed commodi voluptates tempore voluptatum voluptatibus dicta qui delectus natus quo repellat numquam asperiores esse necessitatibus, molestiae a modi unde exercitationem nemo!
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="purple"
                  @click="terms = false"
                >Ok</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="conditions" width="70%">
            <v-card>
              <v-card-title class="title">Conditions</v-card-title>
              <v-card-text>
                Conditions... Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, velit iusto molestiae eius officia porro veniam nostrum a assumenda eos ducimus saepe ullam quasi illum voluptatum eligendi non voluptate id!
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="purple"
                  @click="conditions = false"
                >Ok</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-form>
      </v-stepper-content>

      <v-stepper-step :complete="step > 2" step="2">
        Verify your email address
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-form @submit.prevent="submitSignUpStep2" ref="signUpStep2Form" v-model="forms.signUpStep2.valid" >
          <v-layout wrap class="ma-2" justify-center>
            <v-flex xs12 sm6>
              <p class="text-xs-center">
                Please enter the 6-digit verification code that we sent to your email: <b>{{ data.email }}</b>
              </p>
              <v-text-field outlined v-model="data.verificationCode" :rules="rules.verificationCode" label="Verification code" counter="6" spellcheck="false" validate-on-blur></v-text-field>
            </v-flex>
          </v-layout>
          <v-expand-transition>
            <p class="error--text" v-if="forms.signUpStep2.errorMessage">{{ forms.signUpStep2.errorMessage }}</p>
          </v-expand-transition>
          <v-btn :loading="forms.signUpStep2.loading" :disabled="!forms.signUpStep2.valid" type="submit" color="primary" class="text-none mr-1">Continue</v-btn>
          <v-btn text class="text-none" @click="step = 1">Back</v-btn>
        </v-form>
      </v-stepper-content>

      <v-stepper-step :complete="step > 3" step="3">
        Get started
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-layout wrap class="ma-2" justify-center>
          <v-flex xs12 sm6>
            <p class="text-xs-center">
              Your account is now created and <br>you are now ready to start using duely.
            </p>
          </v-flex>
        </v-layout>
        <v-btn :loading="forms.logIn.loading" class="text-none mr-1" color="primary" @click="logIn">Log in and go to dashboard</v-btn>
        <v-btn text class="text-none" to="/">Cancel</v-btn>
      </v-stepper-content>

    </v-stepper>
  </NarrowLayout>
</template>

<script>
import { client, gql } from '@/apollo';

export default {
  data() {
    return {
      step: 1,
      data: {
        email: decodeURIComponent(this.$route.query.email || ''),
        name: '',
        password: '',
        verificationCode: '',
        acceptTermsAndConditions: false
      },
      rules: {
        email: [
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
      terms: false,
      conditions: false
    };
  },
  watch: {
    ['data.email'](val) {
      this.$router.push({ query: { ...this.$route.query, email: encodeURIComponent(val) } });
    }
  },
  methods: {
    async submitSignUpStep1() {
      this.forms.signUpStep1.errorMessage = null;

      if (this.$refs.signUpStep1Form.validate())
      {
        this.forms.signUpStep1.loading = true;

        const res = await client.mutate({
          mutation: gql`
            mutation($email: String!) {
              startEmailAddressVerification(email: $email) {
                success
                message
              }
            }
          `,
          variables: {
            email: this.data.email
          }
        });

        if (res.data.startEmailAddressVerification.success)
          this.step = 2;
        else
          this.forms.signUpStep1.errorMessage = res.data.startEmailAddressVerification.message;

        this.forms.signUpStep1.loading = false;
      }
    },
    async submitSignUpStep2() {
      this.forms.signUpStep2.errorMessage = null;

      if (this.$refs.signUpStep2Form.validate())
      {
        this.forms.signUpStep2.loading = true;

        const res = await client.mutate({
          mutation: gql`
            mutation($email: String!, $verificationCode: String!, $name: String!, $password: String!) {
              signUp(email: $email, verificationCode: $verificationCode, name: $name, password: $password) {
                success
                message
                account {
                  uuid
                }
              }
            }
          `,
          variables: {
            email: this.data.email,
            verificationCode: this.data.verificationCode,
            name: this.data.name,
            password: this.data.password
          }
        });

        if (res.data.signUp.success)
          this.step = 3;
        else
          this.forms.signUpStep2.errorMessage = res.data.signUp.message;

        this.forms.signUpStep2.loading = false;
      }
    },
    async logIn() {
      this.forms.logIn.loading = true;

      const res = await client.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!) {
            logIn(email: $email, password: $password) {
              success
              message
              session {
                uuid
                jwt
                account {
                  uuid
                  email
                }
              }
            }
          }
        `,
        variables: {
          email: this.data.email,
          password: this.data.password
        }
      });

      if (!res.data.logIn.success) {
        // Unexpected
        this.$router.push({ path: '/' });
        return;
      }

      const jwt = res.data.logIn.session.jwt;

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

        this.$router.push({ path: '/dashboard' });
      }

      this.forms.logIn.loading = false;
    }
  }
}
</script>

