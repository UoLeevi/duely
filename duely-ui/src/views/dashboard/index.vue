<template>
  <DashboardLayout>
    <template #menu>
      <BtnSquare v-for="item in items" :key="item.to" v-bind="item" small :minimized="$vuetify.breakpoint.xs || subMenuItems.length !== 0" :selected="selectedMenu !== null && selectedMenu.to === item.to" />
    </template>
    <template #sub-menu>
      <router-link v-if="!$vuetify.breakpoint.xs && subMenuItems.length !== 0" :to="selectedMenu.to" class="d-flex flex-column align-start">
        <h4 class="f-3b surface--text text--lighten-3 ml-2 py-1">{{ selectedMenu.text }}</h4>
      </router-link>
      <TextLink v-for="item in subMenuItems" :key="item.to" v-bind="item" class="px-2">{{ item.text }}</TextLink>
    </template>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
  </DashboardLayout>
</template>

<script>
import { gql } from '@/apollo';
import DashboardLayout from './layouts/DashboardLayout';
import BtnSquare from '@/components/BtnSquare';
import TextLink from '@/components/TextLink';

export default {
  components: {
    DashboardLayout,
    BtnSquare,
    TextLink
  },
  computed: {
    selectedMenu() {
      const menuPath = this.$route.path.split('/').slice(0, 3).join('/');
      const matches = this.items.filter(item => item.to === menuPath) || this.items.filter(item => item.to.startsWith(menuPath));

      return matches.length == 0
        ? null
        : matches.reduce((prev, curr) => prev.to.length > curr.to.length ? prev : curr);
    },
    subMenuItems() {
      return this.selectedMenu === null ? [] : (this.selectedMenu.items || [])
    }
  },
  data() {
    return {
      items: [
        {
          to: '/dashboard',
          color: 'surface darken-1',
          text: 'Dashboard',
          icon: 'home'
        },
        {
          to: '/dashboard/services',
          color: 'surface darken-1',
          text: 'Services',
          icon: 'business_center'
        },
        {
          to: '/dashboard/payments',
          color: 'surface darken-1',
          text: 'Payments',
          icon: 'attach_money'
        },
        {
          to: '/dashboard/users',
          color: 'surface darken-1',
          text: 'Users',
          icon: 'group',
          items: [
            {
              to: '/dashboard/users/clients',
              text: 'Clients'
            }
          ]
        },
        {
          to: '/dashboard/site',
          color: 'surface darken-1',
          text: 'Site',
          icon: 'web',
          items: [
            {
              to: '/dashboard/site/theme',
              text: 'Theme'
            }
          ]
        },
        {
          to: '/profile',
          color: 'surface darken-1',
          text: 'Profile',
          icon: 'person'
        }
      ]
    };
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
          theme {
            uuid
            name
            imageLogo {
              uuid
              name
              data
              color
            }
            imageHero {
              uuid
              name
              data
              color
            }
            colorPrimary
            colorSecondary
            colorAccent
            colorBackground
            colorSurface
            colorError
            colorSuccess
          }
          servicesConnection {
            edges {
              cursor
              node {
                uuid
                name
                status
                steps {
                  uuid
                  name
                  type
                }
              }
            }
          }
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
        }
      }`,
      variables () {
        return {
          subdomainName: this.session.subdomainName,
        }
      },
      update ({ agency } ) {
        const theme = agency.theme;

        if (theme) {
          this.updateThemeItem('primary', theme.colorPrimary);
          this.updateThemeItem('secondary', theme.colorSecondary);
          this.updateThemeItem('accent', theme.colorAccent);
          this.updateThemeItem('background', theme.colorBackground);
          this.updateThemeItem('surface', theme.colorSurface);
          this.updateThemeItem('error', theme.colorError);
          this.updateThemeItem('success', theme.colorSuccess);
        }

        return agency;
      },
      skip () {
        return this.$apollo.queries.session.loading;
      },
      subscribeToMore: [
        {
          document: gql`subscription {
            serviceCreated {
              uuid
              name
              status
              steps {
                uuid
                name
                type
              }
            }
          }`,
          updateQuery: ({ agency }, { subscriptionData }) => {
            const service = subscriptionData.data.serviceCreated;
            agency.servicesConnection.edges.push({ cursor: null, node: service, __typename: 'AgencyServicesEdge' });
            return { agency };
          }
        },
        {
          document: gql`subscription($serviceUuids: [ID!]!) {
            serviceDeleted(serviceUuids: $serviceUuids)
          }`,
          variables() {
            return {
              serviceUuids: this.agency 
                ? this.agency.servicesConnection.edges.map(edge => edge.node.uuid)
                : []
            }
          },
          updateQuery: ({ agency }, { subscriptionData }) => {
            const uuid = subscriptionData.data.serviceDeleted;
            agency.servicesConnection.edges = agency.servicesConnection.edges
              .filter(edge => edge.node.uuid !== uuid);
            return { agency };
          }
        },
        {
          document: gql`subscription {
            serviceStepCreated {
              uuid
              name
              type
              previous {
                uuid
              }
              service {
                uuid
              }
            }
          }`,
          updateQuery: ({ agency }, { subscriptionData }) => {
            const serviceStep = subscriptionData.data.serviceStepCreated;
            const edge = agency.servicesConnection.edges
              .find(edge => edge.node.uuid === serviceStep.service.uuid);
            const index = serviceStep.previous ? edge.node.steps.map(s => s.uuid).indexOf(serviceStep.previous.uuid) : null;
            edge.node.steps.splice(index + 1, 0, serviceStep);
            return { agency };
          }
        },
        {
          document: gql`subscription($serviceStepUuids: [ID!]!) {
            serviceStepDeleted(serviceStepUuids: $serviceStepUuids)
          }`,
          variables() {
            return {
              serviceStepUuids: this.agency 
                ? this.agency.servicesConnection.edges
                  .flatMap(edge => edge.node.steps)
                  .map(step => step.uuid)
                : []
            }
          },
          updateQuery: ({ agency }, { subscriptionData }) => {
            const uuid = subscriptionData.data.serviceStepDeleted;
            const edge = agency.servicesConnection.edges
              .find(edge => edge.node.steps.map(s => s.uuid).includes(uuid));
            edge.node.steps = edge.node.steps.filter(step => step.uuid !== uuid);
            return { agency };
          }
        }
      ]
    }
  }
};
</script>

<style>
</style>
