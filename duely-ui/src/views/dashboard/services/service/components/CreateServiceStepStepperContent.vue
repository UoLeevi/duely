<template>
  <v-stepper-content v-bind="$attrs" v-on="$listeners" style="max-width: 600px;">
    <v-form @submit.prevent="submitCreateServiceStep" ref="CreateServiceStepForm" v-model="forms.CreateServiceStep.valid">
      <v-col class="pt-1">
        <v-select class="mt-1 mb-2" :append-icon="stepIcon(data.type)" dense solo outlined flat single-line rounded v-model="data.type" :items="types" item-text="name" item-value="key" label="Step type" :menu-props="{ offsetY: true, contentClass: 'rounded-corners-small hide-scrollbar elevation-2 ' }" persistent-hint :hint="''" />
        <v-text-field class="mt-0 mb-2" :hint="'Service step name'" dense solo outlined flat single-line persistent-hint rounded v-model="data.name" :rules="rules.name" label="Step name" spellcheck="false" />
      </v-col>
      <v-expand-transition>
        <p class="error--text" v-if="forms.CreateServiceStep.errorMessage">{{ forms.CreateServiceStep.errorMessage }}</p>
      </v-expand-transition>
      <v-row class="ml-3 mt-1 mb-1">
        <v-btn depressed rounded :loading="forms.CreateServiceStep.loading" :disabled="!forms.CreateServiceStep.valid" type="submit" color="primary" class="text-none mr-4">Create</v-btn>
        <v-btn text depressed rounded class="text-none" to="/dashboard/services">Cancel</v-btn>
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
    previousServiceStep: Object /*{
      uuid
      name
      type
    }*/
  },
  data() {
    return {
      step: 1,
      data: {
        name: '',
        type: ''
      },
      types: [
        {
          key: 'PAYMENT',
          name: 'Payment',
          hint: ''
        },
        {
          key: 'FORM',
          name: 'Form',
          hint: ''
        },
        {
          key: 'CONFIRMATION_BY_AGENCY',
          name: 'Confirmation by agency',
          hint: ''
        },
        {
          key: 'DOCUMENT_DELIVERY',
          name: 'Document delivery',
          hint: ''
        },
        {
          key: 'DOCUMENT_SUBMISSION',
          name: 'Document submission',
          hint: ''
        }
      ],
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
          mutation: gql`mutation($serviceUuid: ID!, $name: String!, $type: ServiceStepType!, $previousServiceStepUuid: ID) {
            createServiceStep(serviceUuid: $serviceUuid, name: $name, type: $type, previousServiceStepUuid: $previousServiceStepUuid) {
              success
              message
              step {
                uuid
              }
            }
          }`,
          variables: {
            serviceUuid: this.service.uuid,
            name: this.data.name,
            type: this.data.type,
            previousServiceStepUuid: this.previousServiceStep ? this.previousServiceStep.uuid : null
          },
          update: (store, { data: { createServiceStep } }) => {
            if (createServiceStep.success) {
              this.step = 2;
            } else
              this.forms.CreateServiceStep.errorMessage =
                createServiceStep.message;

            this.forms.CreateServiceStep.loading = false;
          }
        });
      }
    }
  }
}
</script>
