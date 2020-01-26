<template>
  <section>
    <v-progress-circular v-if="$apollo.queries.me.loading" indeterminate />
    <template v-else>
      <h2 class="f-5b">Agencies</h2>
      <div class="d-flex flex-column mt-2" v-if="agencies.filter(agency => agency.roles.includes('agent')).length > 0">
        <b :class="`f-4`">Your agencies</b>
        <div class="d-flex flex-row mb-4">
          <v-card v-for="agency in agencies.filter(agency => agency.roles.includes('agent'))" :key="agency.uuid" :color="agency.theme ? agency.theme.colorPrimary : 'primary'" dark flat class="rounded-corners-small pa-1 ma-1">
            <v-card-text class="white--text">
              <h3 class="f-3b pb-1">{{ agency.name }}</h3>
              <router-link :to="`/dashboard?subdomain=${agency.subdomain.name}`" ><span class="f-2b surface--text text--lighten-3">{{ agency.subdomain.name }}.duely.app</span></router-link>
            </v-card-text>

            <v-card-actions>
            </v-card-actions>
          </v-card>
        </div>
      </div>
      <div class="d-flex flex-row mt-2" v-if="agencies.filter(agency => agency.roles.includes('client')).length > 0">
        <b :class="`f-4`">Agencies you work with</b>
      </div>
    </template>
  </section>
</template>

<script>
import { gql } from '@/apollo';

export default {
  computed: {
    agencies() {
      return this.me.agenciesConnection.edges.map(edge => ({
        ...edge.node,
        roles: edge.roles
      }));
    }
  },
  apollo : {
    me: gql`query {
      me {
        uuid
        name
        agenciesConnection {
          edges {
            cursor
            roles
            node {
              uuid
              name
              subdomain {
                uuid
                name
              }
              theme {
                uuid
                colorPrimary
                colorSecondary
              }
            }
          }
        }
      }
    }`
  }
};
</script>
