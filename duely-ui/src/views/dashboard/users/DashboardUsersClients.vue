<template>
  <section class="d-flex flex-column flex-grow-1">
    <h2 class="f-5b">Client</h2>
    <TableList>
      <template #header>
        <TableListHeaderRow>
          <TableListColumnHeader left>Name</TableListColumnHeader>
          <TableListColumnHeader left>Email address</TableListColumnHeader>
          <TableListColumnHeader center>Status</TableListColumnHeader>
        </TableListHeaderRow>
      </template>
      <TableListRow v-for="client in clients" :key="client.uuid">
        <TableListCell left>
          <span class="f-2b surface--text">{{ client.name }}</span>
        </TableListCell>
        <TableListCell left>
          <span class="f-2 text-no-wrap surface--text">{{ client.emailAddress }}</span>
        </TableListCell>
        <TableListCell center>
          <ColoredChip :color="statusColor(client.status)">{{ client.status }}</ColoredChip>
        </TableListCell>
      </TableListRow>
      <template #actions>
        <NewUserDialog :agency="agency" role="client" />
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

import NewUserDialog from './components/NewUserDialog';

import { gql } from '@/apollo';

export default {
  components: {
    ColoredChip,
    TableList,
    TableListCell,
    TableListColumnHeader,
    TableListHeaderRow,
    TableListRow,
    NewUserDialog
  },
  methods: {
    truncateString(text, length) {
      if (text.length <= length) return text;

      var subString = text.substring(0, length - 1);
      return subString.substring(0, subString.lastIndexOf(' ')) + '…';
    },
    statusColor(status) {
      switch (status) {
        case 'active':
          return 'green';
        case 'invited':
          return 'blue';
        case 'inactive':
          return 'grey';
      }
    }
  },
  computed: {
    clients() {
      if (this.$apollo.queries.agency.loading || !this.$apollo.queries.agency)
        return [];

      const users = this.agency.subjectsConnection.edges
        .filter(edge => edge.roles.includes('client'))
        .map(edge => edge.node)
        .map(user => ({ ...user, status: 'active' }));

      const invited = this.agency.invitesConnection.edges
        .map(edge => edge.node)
        .filter(invite => invite.status === null)
        .map(invite => ({ name: invite.inviteeEmailAddress, emailAddress: invite.inviteeEmailAddress, status: 'invited' }));

      return users.concat(invited);
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
    agency: {
      query: gql`
        query($subdomainName: String) {
          agency(subdomainName: $subdomainName) {
            uuid
            name
            subjectsConnection {
              edges {
                cursor
                roles
                node {
                  uuid
                  name
                  emailAddress
                }
              }
            }
            invitesConnection {
              edges {
                cursor
                node {
                  uuid
                  status
                  inviteeEmailAddress
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
        }
      `,
      variables() {
        return {
          subdomainName: this.session.subdomainName
        };
      },
      skip() {
        return this.$apollo.queries.session.loading;
      }
    }
  }
};
</script>
