<template>
  <section style="width: 100%;">
    <template v-if="$apollo.queries.service.loading">
      <h2 class="f-5b">{{ 'Loading...' }}</h2>
      <v-progress-circular indeterminate />
    </template>
    <template v-else>
      <h2 class="f-5b">{{ service.name }}</h2>
      <v-img v-if="service.imageHero" :src="service.imageHero.data" contain :width="`${adjustSize(530)}`" class="my-auto" />
      <div v-if="service.description" v-html="descriptionHtml"></div>

    </template>
  </section>
</template>

<script>
import { gql } from '@/apollo';
import DOMPurify from 'dompurify';
import marked from 'marked';

export default {
  computed: {
    descriptionHtml() {
      return this.service && this.service.description
        ? DOMPurify.sanitize(marked(this.service.description))
        : null;
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
            description
            price
            currency
            duration
            steps {
              uuid
              name
              type
            }
            imageLogo {
              uuid
              name
              data
              color
            }
            imageHero {
              uuid
              name
              data
              color
            }
            agency {
              uuid
            }
          }
        }
      `,
      variables() {
        return {
          uuid: this.$route.params.uuid
        };
      }
    }
  }
};
</script>

