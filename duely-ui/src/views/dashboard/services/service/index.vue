<template>
  <section style="width: 100%;">
    <h2 class="f-5b">{{ $apollo.queries.service.loading ? 'Service...' : service.name }}</h2>
    <v-progress-circular v-if="$apollo.queries.service.loading" indeterminate />
    <!-- <v-timeline dense clipped>
      <v-timeline-item small icon="add" fill-dot></v-timeline-item>
      <template v-for="step in service ? service.steps : []">
        <v-timeline-item :key="serviceStep.uuid" :icon="stepIcon(serviceStep.type)" fill-dot>{{ serviceStep.name }}</v-timeline-item>
        <v-timeline-item small :key="serviceStep.uuid + '_'" icon="add" fill-dot></v-timeline-item>
      </template>
    </v-timeline> -->
    <v-stepper v-if="$vuetify.breakpoint.lgAndUp" v-model="step" class="service-steps elevation-0" alt-labels :style="{ 'background-color': colorHex('background lighten-5')}">
      <v-stepper-header class="elevation-0">
        <v-stepper-step step="1" editable complete edit-icon="add" color="background lighten-2" class="add px-0" />
        <template v-for="(serviceStep, index) in service ? service.steps : []">
          <v-divider :key="serviceStep.uuid + '__'" />
          <v-stepper-step :key="serviceStep.uuid" :step="(index + 1) * 2" editable complete :edit-icon="stepIcon(serviceStep.type)" :color="stepColor(serviceStep.type)" class="step px-0">
            <span class="f-2b text-no-wrap">{{ serviceStep.name }}</span>
            <span class="f-1b text-no-wrap background--text text--lighten-1">{{ stepTypeName(serviceStep.type) }}</span>
          </v-stepper-step>
          <v-divider :key="serviceStep.uuid + '___'" />
          <v-stepper-step :key="serviceStep.uuid + '_'" :step="(index + 1) * 2 + 1" editable complete edit-icon="add" color="background lighten-2" class="add px-0" />
        </template>
      </v-stepper-header>
      <v-stepper-items class="elevation-0">
        <CreateServiceStepStepperContent step="1" :service="service" />
        <template v-for="(serviceStep, index) in service ? service.steps : []">
          <ServiceStepStepperContent :key="serviceStep.uuid" :step="(index + 1) * 2" :service="service" :serviceStep="serviceStep" />
          <CreateServiceStepStepperContent :key="serviceStep.uuid + '_'" :step="(index + 1) * 2 + 1" :service="service" :previousServiceStep="serviceStep" />
        </template>
      </v-stepper-items>
    </v-stepper>
    <v-stepper v-else vertical v-model="step" class="service-steps vertical elevation-0" :style="{ 'background-color': colorHex('background lighten-5')}">
      <v-stepper-step step="1" editable complete edit-icon="add" color="background lighten-2" class="add">
        <v-fade-transition>
          <span v-show="step == 1" class="f-2b text-no-wrap">Create step</span>
        </v-fade-transition>
      </v-stepper-step>
      <CreateServiceStepStepperContent step="1" :service="service" />
      <template v-for="(serviceStep, index) in service ? service.steps : []">
        <v-stepper-step :key="serviceStep.uuid" :step="(index + 1) * 2" editable complete :edit-icon="stepIcon(serviceStep.type)" :color="stepColor(serviceStep.type)" class="step">
          <span class="f-2b text-no-wrap">{{ serviceStep.name }}</span>
          <span class="f-1b text-no-wrap background--text text--lighten-1">{{ stepTypeName(serviceStep.type) }}</span>
        </v-stepper-step>
        <ServiceStepStepperContent :key="serviceStep.uuid + '_'" :step="(index + 1) * 2" :service="service" :serviceStep="serviceStep" />
        <v-stepper-step :key="serviceStep.uuid + '__'" :step="(index + 1) * 2 + 1" editable complete edit-icon="add" color="background lighten-2" class="add">
          <v-fade-transition>
            <span v-show="step == (index + 1) * 2 + 1" class="f-2b text-no-wrap">Create step</span>
          </v-fade-transition>
        </v-stepper-step>
        <CreateServiceStepStepperContent :key="serviceStep.uuid + '___'" :step="(index + 1) * 2 + 1" :service="service" :previousServiceStep="serviceStep" />
      </template>
    </v-stepper>
  </section>
</template>

<script>
import CreateServiceStepStepperContent from './components/CreateServiceStepStepperContent';
import ServiceStepStepperContent from './components/ServiceStepStepperContent';

import { gql } from '@/apollo';

export default {
  components: {
    CreateServiceStepStepperContent,
    ServiceStepStepperContent
  },
  data() {
    return {
      step: 1,
      data: {
        name: '',
        type: ''
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
    stepTypeName(type) {
      switch (type) {
        case 'PAYMENT':
          return 'Payment';

        case 'FORM':
          return 'Form';

        case 'CONFIRMATION_BY_AGENCY':
          return 'Confirmation by agency';

        case 'DOCUMENT_DELIVERY':
          return 'Document delivery';

        case 'DOCUMENT_SUBMISSION':
          return 'Document submission';

        default:
          return '';
      }
    },
    stepIcon(type) {
      switch (type) {
        case 'PAYMENT':
          return 'payment';

        case 'FORM':
          return 'assignment';

        case 'CONFIRMATION_BY_AGENCY':
          return 'assignment_turned_in';

        case 'DOCUMENT_DELIVERY':
          return 'save_alt';

        case 'DOCUMENT_SUBMISSION':
          return 'note_add';

        default:
          return '';
      }
    },
    stepColor(type) {
      switch (type) {
        case 'PAYMENT':
          return 'primary';

        case 'FORM':
          return 'secondary';

        case 'CONFIRMATION_BY_AGENCY':
          return 'accent';

        case 'DOCUMENT_DELIVERY':
          return 'success';

        case 'DOCUMENT_SUBMISSION':
          return 'accent darken-2';

        default:
          return '';
      }
    },
    async submitCreateServiceStep() {
      this.forms.CreateServiceStep.errorMessage = null;

      if (this.$refs.CreateServiceStepForm.validate()) {
        this.forms.CreateServiceStep.loading = true;

        await this.$apollo.mutate({
          mutation: gql`mutation($agencyUuid: ID!, $name: String!, $type: ServiceStepType!) {
            CreateServiceStep(agencyUuid: $agencyUuid, name: $name, type: $type) {
              success
              message
              serviceUuid
            }
          }`,
          variables: {
            agencyUuid: this.agency.uuid,
            name: this.data.name,
            type: this.data.type
          },
          update: (store, { data: { CreateServiceStep } }) => {
            if (CreateServiceStep.success) {
              this.step = 2;
              this.$router.push({ path: '/dashboard/services' });
            } else
              this.forms.CreateServiceStep.errorMessage =
                CreateServiceStep.message;

            this.forms.CreateServiceStep.loading = false;
          }
        });
      }
    }
  },
  apollo: {
    service: {
      query: gql`
        query($uuid: ID!) {
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
        }
      `,
      variables() {
        return {
          uuid: this.$route.params.uuid
        };
      },
      update({ service }) {
        if (service.steps.length !== 0)
          this.step = 2;

        return service;
      }
    }
  }
};
</script>

<style>
.service-steps.v-stepper .v-stepper__step--editable:hover {
  background: inherit;
}

/* .service-steps.v-stepper .v-stepper__step--active .v-stepper__step__step {
box-shadow: 0px 0px 0px 0.2rem var(--v-surface-darken2), 0px 0px 0px 0.35rem,
    0px 0px 1rem 0.35rem rgba(0, 0, 0, 0.5), 0px 0px 1rem 0.35rem;
} */

.service-steps.v-stepper .v-stepper__step--editable:hover .v-stepper__step__step {
  box-shadow: 0px 0px 0px 0.2rem, 0px 0px 1rem 0.2rem rgba(0, 0, 0, 0.5),
    0px 0px 1rem 0.2rem;
}

.service-steps.v-stepper .step .v-stepper__step__step {
  padding: 1rem;
  margin-top: -0.25rem;
}

.service-steps.v-stepper.vertcal .step .v-stepper__step__step {
  margin-left: -0.25rem;
}

.service-steps.v-stepper .add .v-stepper__step__step {
  padding: 0.3rem;
  margin-top: -0.075rem;
}
</style>
