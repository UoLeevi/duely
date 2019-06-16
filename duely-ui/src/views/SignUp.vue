<template>
  <NarrowLayout>
    <v-form  @submit.prevent="submit" ref="form">
      <v-stepper v-model="step" vertical class="mt-4">
        <v-stepper-step :complete="step > 1" step="1">
          Sign up for an account
        </v-stepper-step>

        <v-stepper-content step="1">
            <v-layout wrap class="my-2">
              <v-flex xs12 sm6>
                <v-text-field outlined v-model="form.firstName" label="First name" spellcheck="false" :class="{'mr-3': $vuetify.breakpoint.smAndUp}"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field outlined v-model="form.lastName" label="Last name" spellcheck="false"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field outlined v-model="form.email" label="Email address" type="email" spellcheck="false"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field outlined v-model="form.password" label="Password" type="password" spellcheck="false" browser-autocomplete="new-password"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-checkbox v-model="form.terms" off-icon="check_box_outline_blank" on-icon="check_box" color="secondary" class="ml-3 my-0">
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
            <v-btn color="primary" class="text-none mr-1" @click="step = 2">Continue</v-btn>
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
        </v-stepper-content>

        <v-stepper-step :complete="step > 2" step="2">
          Verify your email address
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-layout wrap class="ma-2" justify-center>
            <v-flex xs12 sm6>
              <p class="text-xs-center">
                Please enter the 6-digit verification code that we sent to your email: <b>{{ form.email }}</b>.
              </p>
              <v-text-field outlined label="Verification code" counter="6"></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn color="primary" class="text-none mr-1" @click="step = 3">Continue</v-btn>
          <v-btn text class="text-none" @click="step = 1">Back</v-btn>
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
          <v-btn :loading="form.loading" type="submit" class="text-none mr-1" color="primary">Create account</v-btn>
          <v-btn text class="text-none" to="/">Cancel</v-btn>
        </v-stepper-content>

      </v-stepper>
    </v-form>
  </NarrowLayout>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        terms: false,
        code: '',
        loading: false
      },
      terms: false,
      conditions: false
    };
  },
  methods: {
    submit() {
      this.form.loading = true;
      const router = this.$router;
      window.setTimeout(function () {
        router.replace('/dashboard');
      }, 2000);
    }
  }
}
</script>

