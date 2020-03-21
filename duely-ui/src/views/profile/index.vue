<template>
  <ProfileLayout>
    <template #menu>
      <SquareBtn v-bind="items.agencies" :small="$vuetify.breakpoint.xs" :notification="!$apollo.queries.me.loading && me.invitesConnection.edges.some(edge => edge.node.status === null)" :class="{ 'py-2': !$vuetify.breakpoint.xs }" />
      <SquareBtn v-bind="items.settings" :small="$vuetify.breakpoint.xs" :class="{ 'py-2': !$vuetify.breakpoint.xs }" />
    </template>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
  </ProfileLayout>
</template>

<script>
import { gql } from '@/apollo';

import ProfileLayout from './layouts/ProfileLayout';
import SquareBtn from '@/components/SquareBtn';

export default {
  components: {
    ProfileLayout,
    SquareBtn
  },
  data() {
    return {
      items: {
        agencies: {
          to: '/profile/agencies',
          color: 'blue',
          text: 'Agencies',
          icon: 'home'
        },
        settings: {
          to: '/profile/settings',
          color: 'surface',
          text: 'Settings',
          icon: 'settings'
        }
      }
    };
  },
  apollo: {
    me: {
      query: gql`query {
        me {
          uuid
          name
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
      }`,
      subscribeToMore: [
        {
          document: gql`subscription {
            inviteCreated {
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
          }`,
          updateQuery: ({ me }, { subscriptionData }) => {
            const invite = subscriptionData.data.inviteCreated;
            me.invitesConnection.edges.push({ cursor: null, node: invite, __typename: 'SubjectInvitesEdge' });
            return { me };
          }
        },
        {
          document: gql`subscription($inviteUuids: [ID!]!) {
            inviteDeleted(inviteUuids: $inviteUuids)
          }`,
          variables() {
            return {
              inviteUuids: this.me 
                ? this.me.invitesConnection.edges.map(edge => edge.node.uuid)
                : []
            }
          },
          updateQuery: ({ me }, { subscriptionData }) => {
            const uuid = subscriptionData.data.inviteDeleted;
            me.invitesConnection.edges = me.invitesConnection.edges
              .filter(edge => edge.node.uuid !== uuid);
            return { me };
          }
        }
      ]
    }
  }
};
</script>

