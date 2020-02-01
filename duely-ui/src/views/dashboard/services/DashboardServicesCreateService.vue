<template>
  <section>
    <h2 class="f-5b">Create service</h2>
    <v-progress-circular v-if="$apollo.queries.loading" indeterminate />
    <div v-else style="position: relative;">
    </div>
  </section>
</template>

<script>
import { gql } from '@/apollo';

export default {
  apollo: {
    session: {
      query: gql`query {
        session @client {
          subdomainName
        }
      }`
    },
    services: {
      query: gql`query($subdomainName: String) {
        agency(subdomainName: $subdomainName) {
          uuid
          name
          servicesConnection {
            edges {
              cursor
              node {
                uuid
                name
                status
              }
            }
          }
        }
      }`,
      variables () {
        return {
          subdomainName: this.session.subdomainName,
        }
      },
      update ({ agency }) {
        return agency[0].servicesConnection.edges.map(edge => edge.node);
      },
      skip () {
        return this.$apollo.queries.session.loading;
      }
    }
  }
};
</script>

<style scoped>
tr:last-child td:first-child {
  border-bottom-left-radius: 0.8rem;
}
tr:last-child td:last-child {
  border-bottom-right-radius: 0.8rem;
}
</style>