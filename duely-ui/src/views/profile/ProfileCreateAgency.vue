<template>
  <section class="profile-create-agency">
    <h2 class="f-5b">Create new agency</h2>
    <v-stepper v-model="step" vertical class="elevation-0" :style="{'max-width': '600px', 'background-color': colorHex('background lighten-5')}">

      <v-stepper-step :complete="step > 1" step="1">
        <span class="f-2b text-no-wrap">
          Name your agency
        </span>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-form @submit.prevent="submitCreateAgencyStep1" ref="createAgencyStep1Form" v-model="forms.createAgencyStep1.valid">
          <v-col class="pt-1">
            <v-text-field class="mt-0 mb-2" :hint="'Name of your business'" dense solo outlined flat single-line persistent-hint rounded v-model="data.name" :rules="rules.name" label="Agency name" spellcheck="false" validate-on-blur></v-text-field>
            <v-text-field class="mt-1 mb-2" suffix=".duely.app" :hint="'Your agency will have a subdomain for duely.app'" dense solo outlined flat single-line persistent-hint rounded v-model="data.subdomain" :rules="rules.subdomain" label="Subdomain name" spellcheck="false"></v-text-field>
            <v-select class="mt-1 mb-2" append-icon="public" dense solo outlined flat single-line rounded v-model="data.countryCode" :rules="rules.countryCode" :loading="$apollo.queries.countryCodes.loading" :items="countryCodes || []" item-text="id" item-value="id" label="Country" :menu-props="{ offsetY: true, contentClass: 'rounded-corners-small hide-scrollbar elevation-2 ' }" persistent-hint hint="The country in which the agency will primarily operate in" />
            <div class="f-2 ml-2 mt-1 mb-3">
              By creating an agency on duely, you agree to our <a href="javascript:;" @click.stop="tos = true">Services Agreement</a> and the <a target="_blank" href="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</a>.
            </div>
          </v-col>
          <v-expand-transition>
            <p class="error--text" v-if="forms.createAgencyStep1.errorMessage">{{ forms.createAgencyStep1.errorMessage }}</p>
          </v-expand-transition>
          <v-row class="ml-3 mt-1 mb-1">
            <v-btn depressed rounded :loading="forms.createAgencyStep1.loading" :disabled="!forms.createAgencyStep1.valid" type="submit" color="primary" class="text-none mr-4" >Continue</v-btn>
            <v-btn text depressed rounded class="text-none" to="/profile">Cancel</v-btn>
          </v-row>
        </v-form>
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
      </v-stepper-content>

      <v-stepper-step :complete="step > 2" step="2">
        <span class="f-2b text-no-wrap">
          Verify account on Stripe
        </span>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-col class="pt-1">
          <p>Redirecting to <span class="primary--text">stripe</span>...</p>
          <v-progress-circular indeterminate color="primary"/>
        </v-col>
      </v-stepper-content>
    </v-stepper>
  </section>
</template>

<script>
import { gql } from '@/apollo';

export default {
  data() {
    return {
      step: 1,
      data: {
        name: '',
        subdomain: '',
        countryCode: ''
      },
      rules: {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 70) || 'Name must be at most 70 characters'
        ],
        subdomain: [
          v => !!v || 'Subdomain name is required',
          // eslint-disable-next-line
          v => this.isSubdomainNameValid || 'Invalid subdomain name'
        ],
        countryCode: [
          v => !!v || 'Country is required'
        ],
      },
      forms: {
        createAgencyStep1: {
          errorMessage: null,
          loading: false,
          valid: false
        }
      },
      tos: false
    };
  },
  computed: {
    isSubdomainNameValid() {
      const reservedSubdomains = ['api', 'test', 'example', 'admin'];

      if (reservedSubdomains.includes(this.data.subdomain.toLowerCase()))
        return false;

      if (this.data.subdomain.includes('.')) return false;

      return /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/.test(
        `${this.data.subdomain}.duely.app`
      );
    }
  },
  methods: {
    async submitCreateAgencyStep1() {
      this.forms.createAgencyStep1.errorMessage = null;

      if (this.$refs.createAgencyStep1Form.validate()) {
        this.forms.createAgencyStep1.loading = true;

        const access_token = localStorage.getItem('user-jwt');
        const returnUrl = process.env.NODE_ENV === 'production'
            ? `https://${this.data.subdomain}.duely.app/dashboard?access_token=${access_token}`
            : `${window.location.origin}/dashboard?subdomain=${this.data.subdomain}`;

        await this.$apollo.mutate({
          mutation: gql`mutation($name: String!, $subdomain: String!, $countryCode: String!, $returnUrl: String!) {
            createAgency(name: $name, subdomain: $subdomain, countryCode: $countryCode, returnUrl: $returnUrl) {
              success
              message
              agencyUuid
              stripeVerificationUrl
            }
          }`,
          variables: {
            name: this.data.name,
            subdomain: this.data.subdomain,
            countryCode: this.data.countryCode,
            returnUrl
          },
          update: (store, { data: { createAgency } }) => {
            if (createAgency.success) {
              this.step = 2;
              window.location.replace(createAgency.stripeVerificationUrl);
            }
            else
              this.forms.createAgencyStep1.errorMessage = createAgency.message;

            this.forms.createAgencyStep1.loading = false;
          }
        });
      }
    }
  },
  apollo: {
    countryCodes: gql`query {
      countryCodes
    }`
  }
};
</script>

<style scoped>
.profile-create-agency {
  width: 100%;
}
</style>
