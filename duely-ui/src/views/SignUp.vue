<template>
  <NarrowLayout>
      <v-stepper v-model="step" vertical class="mt-4">
        <v-stepper-step :complete="step > 1" step="1">
          Sign up for an account
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-form @submit.prevent="submitSignUp" ref="signUpForm" v-model="forms.signUp.valid" >
            <v-layout wrap class="my-2">
              <v-flex xs12>
                <v-text-field outlined v-model="forms.signUp.email" :rules="forms.signUp.emailRules" label="Email address" type="email" spellcheck="false" validate-on-blur></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field outlined v-model="forms.signUp.name" :rules="forms.signUp.nameRules" label="Full name" spellcheck="false" validate-on-blur></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field outlined v-model="forms.signUp.password" :rules="forms.signUp.passwordRules" label="Password" type="password" spellcheck="false" autocomplete="new-password" validate-on-blur></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-checkbox v-model="forms.signUp.acceptTermsAndConditions" off-icon="check_box_outline_blank" on-icon="check_box" color="secondary" class="ml-3 my-0">
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
            <v-btn :loading="forms.signUp.loading" :disabled="!(forms.signUp.valid && forms.signUp.acceptTermsAndConditions)" type="submit" color="primary" class="text-none mr-1">Continue</v-btn>
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
          <v-form @submit.prevent="submitVerifyEmailAddress" ref="verifyEmailAddressForm" v-model="forms.verifyEmailAddress.valid" >
            <v-layout wrap class="ma-2" justify-center>
              <v-flex xs12 sm6>
                <p class="text-xs-center">
                  Please enter the 6-digit verification code that we sent to your email: <b>{{ forms.verifyEmailAddress.email }}</b>.
                </p>
                <v-text-field outlined v-model="forms.verifyEmailAddress.verificationCode" :rules="forms.verifyEmailAddress.verificationCodeRules" label="Verification code" counter="6" spellcheck="false" validate-on-blur></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn :loading="forms.verifyEmailAddress.loading" :disabled="!forms.verifyEmailAddress.valid" type="submit" color="primary" class="text-none mr-1" @click="step = 3">Continue</v-btn>
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
                Your account is all set up and ready to be created.
              </p>
            </v-flex>
          </v-layout>
          <v-btn class="text-none mr-1" color="primary">Create account</v-btn>
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
      forms: {
        signUp: {
          email: decodeURIComponent(this.$route.query.email || ''),
          emailRules: [
            v => !!v || 'Email address is required',
            v => /.+@.+\..+/.test(v) || 'Email address must be valid'
          ],
          name: '',
          nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 70) || 'Name must be at most 70 characters'
          ],
          password: '',
          passwordRules: [
            v => !!v || 'Password is required'
          ],
          acceptTermsAndConditions: false,
          loading: false,
          valid: false
        },
        verifyEmailAddress: {
          email: '',
          verificationCode: '',
          verificationCodeRules: [
            v => (v && v.length === 6) || 'Verification code has six digits'
          ],
          loading: false,
          valid: false
        }
      },
      terms: false,
      conditions: false
    };
  },
  watch: {
    ['forms.signUp.email'](val) {
      this.$router.push({ query: { ...this.$route.query, email: encodeURIComponent(val) } });
    }
  },
  methods: {
    async submitSignUp() {
      if (this.$refs.signUpForm.validate())
      {
        this.forms.signUp.loading = true;
        const res = await client.mutate({
          mutation: gql`
            mutation($email: String!, $name: String!, $password: String!) {
              signUp(email: $email, name: $name, password: $password) {
                uuid
                email
                verified
              }
            }
          `,
          variables: {
            email: this.forms.signUp.email,
            name: this.forms.signUp.name,
            password: this.forms.signUp.password
          }
        });

        if (res.data.signUp.email && !res.data.signUp.verified) {
          this.forms.verifyEmailAddress.email = res.data.signUp.email;
          this.step = 2;
        }

        this.forms.signUp.loading = false;
      }
    },
    async submitVerifyEmailAddress() {
      if (this.$refs.verifyEmailAddressForm.validate())
      {
        this.forms.verifyEmailAddressForm.loading = true;
        const res = await client.mutate({
          mutation: gql`
            mutation($email: String!, $verificationCode: String!) {
              verifyEmailAddress(email: $email, verificationCode: $verificationCode) {
                uuid
                email
                verified
              }
            }
          `,
          variables: {
            email: this.forms.verifyEmailAddress.email,
            verificationCode: this.forms.verifyEmailAddress.verificationCode
          }
        });

        if (res.data.verifyEmailAddress.email && res.data.verifyEmailAddress.verified) {
          this.step = 3;
        }

        this.forms.verifyEmailAddress.loading = false;
      }
    }
  }
}
</script>

