<template>
  <section style="width: 100%;">
    <h2 class="f-5b">{{ $apollo.queries.service.loading ? 'Service...' : service.name }}</h2>
    <v-progress-circular v-if="$apollo.queries.service.loading" indeterminate />
  </section>
</template>

<script>
import { gql } from '@/apollo';

export default {
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

