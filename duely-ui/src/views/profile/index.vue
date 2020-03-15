<template>
  <ProfileLayout>
    <template #menu>
      <BtnSquare v-bind="items.agencies" :small="$vuetify.breakpoint.xs" :notification="!$apollo.queries.me.loading && me.invitesConnection.edges.length !== 0" :class="{ 'py-2': !$vuetify.breakpoint.xs }" />
      <BtnSquare v-bind="items.createAgency" :small="$vuetify.breakpoint.xs" :class="{ 'py-2': !$vuetify.breakpoint.xs }" />
      <BtnSquare v-bind="items.settings" :small="$vuetify.breakpoint.xs" :class="{ 'py-2': !$vuetify.breakpoint.xs }" />
    </template>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
  </ProfileLayout>
</template>

<script>
import { gql } from '@/apollo';

import ProfileLayout from './layouts/ProfileLayout';
import BtnSquare from '@/components/BtnSquare';

export default {
  components: {
    ProfileLayout,
    BtnSquare
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
        createAgency: {
          to: '/profile/create-agency',
          color: 'green',
          text: 'Create agency',
          icon: 'add'
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

