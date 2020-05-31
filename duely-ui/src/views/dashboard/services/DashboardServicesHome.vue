<template>
  <section class="d-flex flex-column flex-grow-1">
    <h2 class="f-5b">Services</h2>
    <TableList>
      <template #header>
        <TableListHeaderRow>
          <TableListColumnHeader left>Service</TableListColumnHeader>
          <TableListColumnHeader right>Price</TableListColumnHeader>
          <TableListColumnHeader center>Status</TableListColumnHeader>
          <TableListColumnHeader center>Actions</TableListColumnHeader>
        </TableListHeaderRow>
      </template>
      <TableListRow v-for="service in services" :key="service.uuid">
        <TableListCell left>
          <router-link :to="`/dashboard/services/${service.uuid}`"><span class="f-2b text-no-wrap">{{ service.name }}</span></router-link>
          <span class="f-1 text-no-wrap surface--text text--lighten-2">{{ truncateString(service.description || '', 30) }}</span>
        </TableListCell>
        <TableListCell right>
          <span class="f-2">{{ service.price != null ? (service.price / 100.0).toFixed(2) : 'N/A' }}</span>
          <span class="f-1 text-no-wrap surface--text text--lighten-2">{{ service.currency ? service.currency.toUpperCase() : '' }}</span>
        </TableListCell>
        <TableListCell center>
          <ColoredChip :color="statusColor(service.status)">{{ service.status }}</ColoredChip>
        </TableListCell>
        <TableListCell center>
          <v-btn @click.native="deleteService(service.uuid)" text small color="background lighten-3">
            <v-icon>delete</v-icon>
          </v-btn>
        </TableListCell>
      </TableListRow>
      <template #actions>
        <v-btn to="/dashboard/services/create-service" absolute dark large rounded bottom right color="primary" style="transform: translateY(220%);" class="my-4">
          <span class="text-none f-2b">Create service</span>
          <v-icon right>add</v-icon>
        </v-btn>
      </template>
    </TableList>
  </section>
</template>

<script>
import ColoredChip from '@/components/ColoredChip';

import TableList from '@/components/TableList';
import TableListCell from '@/components/TableListCell';
import TableListColumnHeader from '@/components/TableListColumnHeader';
import TableListHeaderRow from '@/components/TableListHeaderRow';
import TableListRow from '@/components/TableListRow';

import { gql } from '@/apollo';

export default {
  components: {
    ColoredChip,
    TableList,
    TableListCell,
    TableListColumnHeader,
    TableListHeaderRow,
    TableListRow
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
    },
    async deleteService(serviceUuid) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($serviceUuid: ID!) {
            deleteService(serviceUuid: $serviceUuid) {
              success
              message
              serviceUuid
            }
          }
        `,
        variables: {
          serviceUuid
        }
      });
    }
  },
  apollo: {
    session: {
      query: gql`
        query {
          session @client {
            subdomainName
          }
        }
      `
    },
    services: {
      query: gql`
        query($subdomainName: String) {
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
                  description
                  price
                  currency
                  duration
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          subdomainName: this.session.subdomainName
        };
      },
      update({ agency }) {
        return agency.servicesConnection.edges.map(edge => edge.node);
      },
      skip() {
        return this.$apollo.queries.session.loading;
      }
    }
  }
};
</script>
