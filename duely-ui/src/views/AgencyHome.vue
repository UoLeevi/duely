<template>
  <HomeLayout v-custom-scroll>
    <template #app-bar>
      <HomeAppBar :agency="agency" :agencyRoles="agencyRoles" />
    </template>
    <HomeSection v-scroll-target="{ color: 'primary lighten-5' }" section-name="Hero" background-color="primary darken-1" background-color-to="primary lighten-1" :background-tilt="120" text-color="blue lighten-5">
      <div style="max-width: 95%;">
        <h2 class="f-10 text-no-wrap`"><span class="f-10b">Simplified</span> <br>business transactions <br>for agencies.</h2>
        <p class="f-4">Platform for digital agencies. Create a service catalogue, seamlessly manage client deliverables, accept payments and grow your business.</p>
      </div>
      <template #right>
        <v-skeleton-loader v-if="$apollo.queries.agency.loading" type="image" :width="`${adjustSize(530)}`" class="my-auto" />
        <v-img v-else-if="agency.theme && agency.theme.imageHero" :src="agency.theme.imageHero.data" contain :width="`${adjustSize(530)}`" class="my-auto" />
      </template>
    </HomeSection>
  </HomeLayout>
</template>

<script>
import { gql } from '@/apollo';
import HomeLayout from '@/layouts/HomeLayout';
import HomeAppBar from '@/components/HomeAppBar';
import HomeSection from '@/components/HomeSection';

export default {
  components: {
    HomeLayout,
    HomeAppBar,
    HomeSection
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
      }
    },
    agencyRoles: {
      query: gql`query($agencyUuids: [ID!]) {
        me {
          uuid
          name
          type
          agenciesConnection {
            edges(uuids: $agencyUuids) {
              node {
                uuid
              }
              roles
            }
          }
        }
      }`,
      variables() {
        return {
          agencyUuids: this.agency.uuid ? [this.agency.uuid] : null
        };
      },
      update({ me } ) {
        if (me.type === 'visitor' || this.agency === null)
          return [];

        const edge = me.agenciesConnection.edges.find(edge => edge.node.uuid === this.agency.uuid);

        return edge ? edge.roles : [];
      },
      skip() {
        return this.$apollo.queries.session.loading
          || this.$apollo.queries.agency.loading;
      }
    }
  }
};
</script>

<style>

</style>
