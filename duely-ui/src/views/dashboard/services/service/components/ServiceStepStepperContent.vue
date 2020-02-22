<template>
  <v-stepper-content v-bind="$attrs" v-on="$listeners" style="max-width: 600px;">
    <v-form @submit.prevent="submitCreateServiceStep" ref="CreateServiceStepForm" v-model="forms.CreateServiceStep.valid">
      <v-col class="pt-1">
        <v-text-field class="mt-0 mb-2" :hint="'Service step name'" dense solo outlined flat single-line persistent-hint rounded v-model="data.name" :rules="rules.name" label="Service step name" spellcheck="false" />
      </v-col>
      <v-expand-transition>
        <p class="error--text" v-if="forms.CreateServiceStep.errorMessage">{{ forms.CreateServiceStep.errorMessage }}</p>
      </v-expand-transition>
      <v-row class="ml-3 mt-1 mb-1">
        <v-btn depressed rounded :loading="forms.CreateServiceStep.loading" :disabled="!forms.CreateServiceStep.valid" type="submit" color="primary" class="text-none mr-4">Save</v-btn>
        <v-btn text depressed rounded class="text-none" to="/dashboard/services">Cancel</v-btn>
        <v-btn @click.native="deleteServiceStep(serviceStep.uuid)" text depressed rounded color="background lighten-3" class="text-none"><v-icon>delete</v-icon><span>Delete</span></v-btn>
      </v-row>
    </v-form>
  </v-stepper-content>
</template>

<script>
import { gql } from '@/apollo';

export default {
  props: {
    service: Object /*{
      uuid
      name
    }*/,
    serviceStep: Object /*{
      uuid
      name
      type
    }*/
  },
  data() {
    return {
      step: 1,
      data: {
        name: this.serviceStep.name,
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

        default:
          return '';
      }
    },
    stepIcon(type) {
      switch (type) {
        case 'PAYMENT':
          return 'payment';

        default:
          return '';
      }
    },
    stepColor(type) {
      switch (type) {
        case 'PAYMENT':
          return 'primary';

        default:
          return 'primary';
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
    },
    async deleteServiceStep(serviceStepUuid) {
      await this.$apollo.mutate({
        mutation: gql`mutation($serviceStepUuid: ID!) {
          deleteServiceStep(serviceStepUuid: $serviceStepUuid) {
            success
            message
            serviceStepUuid
          }
        }`,
        variables: {
          serviceStepUuid
        }
      });
    }
  }
}
</script>