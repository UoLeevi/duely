<template>
  <section>
    <h2 class="f-5b">{{ $apollo.queries.service.loading ? 'Service...' : service.name }}</h2>
    <v-progress-circular v-if="$apollo.queries.service.loading" indeterminate />
    <v-timeline dense clipped>
      <v-timeline-item small icon="add" fill-dot></v-timeline-item>
      <template v-for="step in service.steps">
        <v-timeline-item :key="step.uuid" :icon="stepIcon(step.type)" fill-dot>{{ step.name }}</v-timeline-item>
        <v-timeline-item small :key="step.uuid + '_'" icon="add" fill-dot></v-timeline-item>
      </template>
    </v-timeline>
    <!-- <v-stepper v-model="step" vertical class="elevation-0" :style="{'width': `${adjustSize(600, 0.7)}px`, 'background-color': colorHex('background lighten-5')}">

      <v-stepper-step :complete="step > 1" step="1">
        Name your service
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-form @submit.prevent="submitCreateServiceStep" ref="CreateServiceStepForm" v-model="forms.CreateServiceStep.valid">
          <v-col class="pt-1">
            <v-text-field class="mt-0 mb-2" :hint="'Service name'" dense solo outlined flat single-line persistent-hint rounded v-model="data.name" :rules="rules.name" label="Service name" spellcheck="false" />
          </v-col>
          <v-expand-transition>
            <p class="error--text" v-if="forms.CreateServiceStep.errorMessage">{{ forms.CreateServiceStep.errorMessage }}</p>
          </v-expand-transition>
          <v-row class="ml-3 mt-1 mb-1">
            <v-btn depressed rounded :loading="forms.CreateServiceStep.loading" :disabled="!forms.CreateServiceStep.valid" type="submit" color="primary" class="text-none mr-4" >Continue</v-btn>
            <v-btn text depressed rounded class="text-none" to="/dashboard/services">Cancel</v-btn>
          </v-row>
        </v-form>
      </v-stepper-content>
    </v-stepper> -->
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
        CreateServiceStep: {
          errorMessage: null,
          loading: false,
          valid: false
        }
      }
    };
  },
  methods: {
    stepIcon(type) {
      switch (type) {
        case 'PAYMENT':
          return 'payment';

        default:
          return '';
      }
    },
    async submitCreateServiceStep() {
      this.forms.CreateServiceStep.errorMessage = null;

      if (this.$refs.CreateServiceStepForm.validate()) {
        this.forms.CreateServiceStep.loading = true;

        await this.$apollo.mutate({
          mutation: gql`mutation($agencyUuid: ID!, $name: String!) {
            CreateServiceStep(agencyUuid: $agencyUuid, name: $name) {
              success
              message
              serviceUuid
            }
          }`,
          variables: {
            agencyUuid: this.agency.uuid,
            name: this.data.name
          },
          update: (store, { data: { CreateServiceStep } }) => {
            if (CreateServiceStep.success) {
              this.step = 2;
              this.$router.push({ path: '/dashboard/services' });
            }
            else
              this.forms.CreateServiceStep.errorMessage = CreateServiceStep.message;

            this.forms.CreateServiceStep.loading = false;
          }
        });
      }
    }
  },
  apollo: {
    service: {
      query: gql`query($uuid: ID!) {
        service(uuid: $uuid) {
          uuid
          name
          status
          steps {
            uuid
            name
            type
          }
        }
      }`,
      variables () {
        return {
          uuid: this.$route.params.uuid
        }
      }
    }
  }
};
</script>
