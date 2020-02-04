<template>
  <section>
    <h2 class="f-5b">Create service</h2>
    <v-progress-circular v-if="$apollo.queries.loading" indeterminate />
    <v-stepper v-model="step" vertical class="elevation-0" :style="{'width': `${adjustSize(600, 0.7)}px`, 'background-color': colorHex('background lighten-5')}">

      <v-stepper-step :complete="step > 1" step="1">
        Name your service
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-form @submit.prevent="submitCreateService" ref="createServiceForm" v-model="forms.createService.valid">
          <v-col class="pt-1">
            <v-text-field class="mt-0 mb-2" :hint="'Service name'" dense solo outlined flat single-line persistent-hint rounded v-model="data.name" :rules="rules.name" label="Service name" spellcheck="false" />
          </v-col>
          <v-expand-transition>
            <p class="error--text" v-if="forms.createService.errorMessage">{{ forms.createService.errorMessage }}</p>
          </v-expand-transition>
          <v-row class="ml-3 mt-1 mb-1">
            <v-btn depressed rounded :loading="forms.createService.loading" :disabled="!forms.createService.valid" type="submit" color="primary" class="text-none mr-4" >Continue</v-btn>
            <v-btn text depressed rounded class="text-none" to="/dashboard/services">Cancel</v-btn>
          </v-row>
        </v-form>
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
        name: ''
      },
      rules: {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 70) || 'Name must be at most 70 characters'
        ]
      },
      forms: {
        createService: {
          errorMessage: null,
          loading: false,
          valid: false
        }
      }
    };
  },
  methods: {
    async submitCreateService() {
      this.forms.createService.errorMessage = null;

      if (this.$refs.createServiceForm.validate()) {
        this.forms.createService.loading = true;

        await this.$apollo.mutate({
          mutation: gql`mutation($agencyUuid: ID!, $name: String!) {
            createService(agencyUuid: $agencyUuid, name: $name) {
              success
              message
              serviceUuid
            }
          }`,
          variables: {
            agencyUuid: this.agency.uuid,
            name: this.data.name
          },
          update: (store, { data: { createService } }) => {
            if (createService.success) {
              this.step = 2;
              this.$router.push({ path: '/dashboard/services' });
            }
            else
              this.forms.createService.errorMessage = createService.message;

            this.forms.createService.loading = false;
          }
        });
      }
    }
  },
  apollo: {
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
      update ({ agency }) {
        return agency;
      },
      skip () {
        return this.$apollo.queries.session.loading;
      }
    }
  }
};
</script>
