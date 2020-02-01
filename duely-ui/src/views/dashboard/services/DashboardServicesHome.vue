<template>
  <section>
    <h2 class="f-5b">Services</h2>
    <v-progress-circular v-if="$apollo.queries.loading" indeterminate />
    <div v-else style="position: relative;">
      <v-simple-table fixed-header class="rounded-corners-small" :style="{ 'background-color': colorHex('background lighten-5') }">
        <template #default>
          <thead>
            <tr>
              <th class="text-left text-no-wrap f-2b surface--text text--lighten-2" :style="{ 'background-color': colorHex('background lighten-5') }">Service</th>
              <th class="text-left text-no-wrap f-2b surface--text text--lighten-2" :style="{ 'background-color': colorHex('background lighten-5') }">Timeline</th>
              <th class="text-left text-no-wrap f-2b surface--text text--lighten-2" :style="{ 'background-color': colorHex('background lighten-5') }">Payment plan</th>
              <th class="text-left text-no-wrap f-2b surface--text text--lighten-2" :style="{ 'background-color': colorHex('background lighten-5') }">Deliverables</th>
              <th class="text-left text-no-wrap f-2b surface--text text--lighten-2" :style="{ 'background-color': colorHex('background lighten-5') }">Number of active clients</th>
              <th class="text-center text-no-wrap f-2b surface--text text--lighten-2" :style="{ 'background-color': colorHex('background lighten-5') }">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in services" :key="item.name" style="height: 70px;">
              <td>
                <div class="d-flex flex-column">
                  <span class="f-2b text-no-wrap">{{ item.name }}</span>
                  <span class="f-1 text-no-wrap surface--text text--lighten-2">{{ truncateString(item.name, 30) }}</span>
                </div>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="text-center"><span class="f-1b rounded-corners-tiny d-inline-block" :style="{ 'line-height': '2rem', 'min-width': '100px', 'background-color': colorHex(statusColor(item.status) + ' lighten5'), 'color': colorHex(statusColor(item.status)) }">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-btn to="/dashboard/services/create-service" absolute dark large rounded bottom right color="primary" style="transform: translateY(220%);" class="my-4">
        <span class="text-none f-2b">Create service</span>
        <v-icon right>add</v-icon>
      </v-btn>
    </div>
  </section>
</template>

<script>
import { gql } from '@/apollo';

export default {
  methods: {
    truncateString(text, length) {
      if (text.length <= length) return text;

      var subString = text.substring(0, length - 1);
      return subString.substring(0, subString.lastIndexOf(' ')) + '…';
    },
    statusColor(status) {
      switch (status) {
        case 'live':
          return 'green';
        case 'invite only':
          return 'blue';
        case 'draft':
          return 'red';
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