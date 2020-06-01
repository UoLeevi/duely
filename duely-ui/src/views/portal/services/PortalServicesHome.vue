<template>
  <section class="d-flex flex-column flex-grow-1">
    <TableList>
      <template #header>
        <TableListHeaderRow>
          <TableListColumnHeader left>Service</TableListColumnHeader>
        </TableListHeaderRow>
      </template>
      <TableListRow v-for="service in services" :key="service.uuid">
        <TableListCell left>
          <router-link :to="`/portal/services/${service.uuid}`"><span class="f-2b text-no-wrap">{{ service.name }}</span></router-link>
          <span class="f-1 text-no-wrap surface--text text--lighten-2">{{ truncateString(service.name, 30) }}</span>
        </TableListCell>
      </TableListRow>
    </TableList>
  </section>
</template>

<script>
import TableList from '@/components/TableList';
import TableListCell from '@/components/TableListCell';
import TableListColumnHeader from '@/components/TableListColumnHeader';
import TableListHeaderRow from '@/components/TableListHeaderRow';
import TableListRow from '@/components/TableListRow';

import { gql } from '@/apollo';

export default {
  components: {
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
              edges(status: "live") {
                cursor
                node {
                  uuid
                  name
                  status
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
