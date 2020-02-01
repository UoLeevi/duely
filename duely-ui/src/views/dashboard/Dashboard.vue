<template>
  <DashboardLayout>
    <template #menu>
      <v-row no-gutters class="flex-column justify-center align-self-center">
        <BtnSquare v-for="item in items" :key="item.to" v-bind="item" small :minimized="subMenuItems.length !== 0" :selected="selectedMenu !== null && selectedMenu.to === item.to" />
      </v-row>
    </template>
    <template #sub-menu>
      <v-row no-gutters class="mt-6 flex-column align-self-start">
        <h4 v-if="subMenuItems.length !== 0" class="ml-3 py-0 f-3b surface--text text--lighten-3">{{ selectedMenu.text }}</h4>
        <TextLink v-for="item in subMenuItems" :key="item.to" v-bind="item" >{{ item.text }}</TextLink>
      </v-row>
    </template>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
    <v-navigation-drawer v-if="$route.matched.some(r => r.components.panel !== undefined)" :value="true" app floating stateless right :width="adjustSize(600, 0.3)" class="justify-center d-flex flex-column pa-5" color="surface lighten-5">
      <v-fade-transition mode="out-in">
      <router-view name="panel" />
    </v-fade-transition>
    </v-navigation-drawer>
  </DashboardLayout>
</template>

<script>
import { gql } from '@/apollo';
import BtnSquare from '@/components/BtnSquare';
import TextLink from '@/components/TextLink';

export default {
  components: {
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
          to: '/dashboard/company',
          color: 'surface darken-1',
          text: 'Company',
          icon: 'group'
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
        }
      }`,
      variables () {
        return {
          subdomainName: this.session.subdomainName,
        }
      },
      update ({ agency } ) {
        const theme = agency[0].theme;
        
        if (theme) {
          this.updateThemeItem('primary', theme.colorPrimary);
          this.updateThemeItem('secondary', theme.colorSecondary);
          this.updateThemeItem('accent', theme.colorAccent);
          this.updateThemeItem('background', theme.colorBackground);
          this.updateThemeItem('surface', theme.colorSurface);
          this.updateThemeItem('error', theme.colorError);
          this.updateThemeItem('success', theme.colorSuccess);
        }

        return agency[0];
      },
      skip () {
        return this.$apollo.queries.session.loading;
      }
    }
  }
};
</script>

<style>
</style>
