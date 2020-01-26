<template>
  <section class="d-flex flex-column" style="width: 100%;">
    <v-container fluid class="ma-0 pa-0">
      <v-row no-gutters justify="space-between">
        <h2 class="f-5b">Services</h2>
      </v-row>
    </v-container>
    <v-container class="content fill-height rounded-corners">
      <v-row class="fill-height" no-gutters>
        <v-progress-circular v-if="$apollo.queries.loading" indeterminate />
        <v-simple-table v-else fixed-header class="flex-grow-1">
          <template #default>
            <thead>
              <tr>
                <th class="text-left f-2b surface--text text--lighten-3">Service</th>
                <th class="text-left f-2b surface--text text--lighten-3">Timeline</th>
                <th class="text-left f-2b surface--text text--lighten-3">Payment plan</th>
                <th class="text-left f-2b surface--text text--lighten-3">Deliverables</th>
                <th class="text-left f-2b surface--text text--lighten-3">Number of active clients</th>
                <th class="text-center f-2b surface--text text--lighten-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in services" :key="item.name" style="height: 70px;">
                <td>
                  <div class="d-flex flex-column">
                    <span class="f-2b">{{ item.name }}</span>
                    <span class="f-1 surface--text text--lighten-2">{{ truncateString(item.name, 30) }}</span>
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
      </v-row>
    </v-container>
  </section>
</template>

<script>
import { gql } from '@/apollo';

export default {
  data() {
    return {
      items: [
        {
          name: 'Keyword research',
          description:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry',
          status: 'Live'
        },
        {
          name: 'Content brief',
          description:
            'There are many variations of passages of Lorem Ipsum available',
          status: 'Draft'
        },
        {
          name: 'Technical audit',
          description:
            'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout',
          status: 'Invite only'
        }
      ]
    };
  },
  computed: {
    services() {
      return this.agency ? this.agency[0].servicesConnection.edges.map(edge => edge.node) : [];
    }
  },
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
    agency: {
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
      skip () {
        return this.$apollo.queries.session.loading;
      }
    }
  }
};
</script>

<style scoped>
.content {
  background-color: white;
}
</style>