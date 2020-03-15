<template>
  <section>
    <v-progress-circular v-if="$apollo.queries.me.loading" indeterminate />
    <template v-else>
      <h2 class="f-5b">Agencies</h2>
      <div class="d-flex flex-column mt-2" v-if="agencies.filter(agency => agency.roles.includes('agent')).length > 0">
        <b :class="`f-4`">Your agencies</b>
        <div class="d-flex flex-row flex-wrap mb-4">
          <AgencyCard v-for="agency in agencies.filter(agency => agency.roles.includes('agent'))" :key="agency.uuid" :agency="agency" />
        </div>
      </div>
      <div class="d-flex flex-column mt-2" v-if="agencies.filter(agency => agency.roles.includes('client')).length > 0">
        <b :class="`f-4`">Agencies you work with</b>
        <div class="d-flex flex-row flex-wrap mb-4">
          <AgencyCard v-for="agency in agencies.filter(agency => agency.roles.includes('client'))" :key="agency.uuid" :agency="agency" />
        </div>
      </div>
      <div class="d-flex flex-column mt-2" v-if="invites.length > 0">
        <b :class="`f-4`">Invites from agencies</b>
        <div class="d-flex flex-row flex-wrap mb-4">
          <AgencyCard v-for="invite in invites" :key="invite.uuid" :agency="invite.agency" :invite="invite" />
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import { gql } from '@/apollo';
import AgencyCard from './components/AgencyCard';

export default {
  components: {
    AgencyCard
  },
  computed: {
    agencies() {
      return this.me.agenciesConnection.edges.map(edge => ({
        ...edge.node,
        roles: edge.roles
      }));
    },
    invites() {
      return this.me.invitesConnection.edges
        .map(edge => edge.node)
        .filter(invite => invite.status === null);
    }
  },
  apollo : {
    me: {
      query: gql`query {
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
                  name
                  imageLogo {
                    uuid
                    name
                    color
                    data
                  }
                  imageHero {
                    uuid
                    name
                    color
                    data
                  }
                  colorPrimary
                  colorSecondary
                  colorAccent
                  colorBackground
                  colorSurface
                  colorError
                  colorSuccess
                }
              }
            }
          }
          invitesConnection {
            edges {
              node {
                uuid
                status
                agency {
                  uuid
                  name
                  subdomain {
                    uuid
                    name
                  }
                }
              }
            }
          }
        }
      }`
    }
  }
};
</script>
