<template>
  <section>
    <h2 class="f-5b">Theme</h2>
    <v-fade-transition mode="out-in">
      <v-progress-circular v-if="$apollo.loading" />
      <v-form v-else @submit.prevent="submitEditAgencyTheme" ref="editAgencyThemeForm" v-model="forms.editAgencyTheme.valid">
        <v-col class="pt-1">
          <v-text-field v-model="data.colorPrimary" background-color="primary lighten-4" color="primary" label="Primary color" hint="A primary color is the color displayed most frequently across your app’s screens and components." class="mt-0 mb-2 primary--text" prefix="#" dense filled persistent-hint rounded :rules="rules.color" spellcheck="false" validate-on-blur append-icon="color_lens"/>
          <v-text-field v-model="data.colorSecondary" background-color="secondary lighten-4" color="secondary" label="Secondary color" hint="A secondary color provides more ways to accent and distinguish your product." class="mt-0 mb-2 secondary--text" prefix="#" dense filled persistent-hint rounded :rules="rules.color" spellcheck="false" validate-on-blur append-icon="color_lens"/>
          <v-text-field v-model="data.colorAccent" background-color="accent lighten-4" color="accent" label="Accent color" hint="Accent color is used for small elements to provide variation to color scheme." class="mt-0 mb-2 accent--text" prefix="#" dense filled persistent-hint rounded :rules="rules.color" spellcheck="false" validate-on-blur append-icon="color_lens"/>
          <v-text-field v-model="data.colorBackground" background-color="background lighten-4" color="background" label="Background color" hint="The background color appears behind scrollable content." class="mt-0 mb-2 background--text" prefix="#" dense filled persistent-hint rounded :rules="rules.color" spellcheck="false" validate-on-blur append-icon="color_lens"/>
          <v-text-field v-model="data.colorSurface" background-color="surface lighten-4" color="surface" label="Surface color" hint="Surface colors affect surfaces of components, such as cards, sheets, and menus." class="mt-0 mb-2 surface--text" prefix="#" dense filled persistent-hint rounded :rules="rules.color" spellcheck="false" validate-on-blur append-icon="color_lens"/>
          <v-text-field v-model="data.colorError" background-color="error lighten-4" color="error" label="Error color" hint="Error color indicates errors in components, such as invalid text in a text field" class="mt-0 mb-2 error--text" prefix="#" dense filled persistent-hint rounded :rules="rules.color" spellcheck="false" validate-on-blur append-icon="color_lens"/>
          <v-text-field v-model="data.colorSuccess" background-color="success lighten-4" color="success" label="Success color" hint="Success color can be used to indicate valid data or successful completion." class="mt-0 mb-2 success--text" prefix="#" dense filled persistent-hint rounded :rules="rules.color" spellcheck="false" validate-on-blur append-icon="color_lens"/>
        </v-col>
        <v-expand-transition>
          <p class="error--text" v-if="forms.editAgencyTheme.errorMessage">{{ forms.editAgencyTheme.errorMessage }}</p>
        </v-expand-transition>
        <v-row class="ml-3 mt-1 mb-1">
          <v-btn depressed rounded :loading="forms.editAgencyTheme.loading" :disabled="!forms.editAgencyTheme.valid" type="submit" color="primary" class="text-none mr-4" >Save</v-btn>
          <v-btn text depressed rounded class="text-none" to="/dashboard/site">Cancel</v-btn>
        </v-row>
      </v-form>
    </v-fade-transition>
  </section>
</template>

<script>
import { gql } from '@/apollo';

export default {
  data(vm) {
    return {
      initialTheme: JSON.parse(JSON.stringify(vm.$vuetify.theme.currentTheme)),
      data: {
        imageLogo: 'dGVzdAo=',
        imageHero: 'dGVzdAo=',
        colorPrimary: '',
        colorSecondary: '',
        colorAccent: '',
        colorBackground: '',
        colorSurface: '',
        colorError: '',
        colorSuccess: ''
      },
      rules: {
        color: [
          v => /^(?:[0-9a-fA-F]{3}){1,2}$/.test(v) || 'Hexadecimal color code is expected',
        ],
        image: [
          v => !!v || 'File is required'
        ]
      },
      forms: {
        editAgencyTheme: {
          errorMessage: null,
          loading: false,
          valid: true
        }
      }
    };
  },
  watch: {
    'data.colorPrimary'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('primary', `#${color}`);
    },
    'data.colorSecondary'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('secondary', `#${color}`);
    },
    'data.colorAccent'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('accent', `#${color}`);
    },
    'data.colorBackground'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('background', `#${color}`);
    },
    'data.colorSurface'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('surface', `#${color}`);
    },
    'data.colorError'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('error', `#${color}`);
    },
    'data.colorSuccess'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('success', `#${color}`);
    }
  },
  methods: {
    async submitEditAgencyTheme() {
      this.forms.editAgencyTheme.errorMessage = null;

      if (this.$refs.editAgencyThemeForm.validate()) {
        this.forms.editAgencyTheme.loading = true;

        await this.$apollo.mutate({
          mutation: gql`mutation($agencyUuid: ID!, $imageLogo: String!, $imageHero: String!, $colorPrimary: String!, $colorSecondary: String!, $colorAccent: String!, $colorBackground: String!, $colorSurface: String!, $colorError: String!, $colorSuccess: String!) {
            editAgencyTheme(agencyUuid: $agencyUuid, imageLogo: $imageLogo, imageHero: $imageHero, colorPrimary: $colorPrimary, colorSecondary: $colorSecondary, colorAccent: $colorAccent, colorBackground: $colorBackground, colorSurface: $colorSurface, colorError: $colorError, colorSuccess: $colorSuccess) {
              success
              message
              themeUuid
            }
          }`,
          variables: {
            agencyUuid: this.agency !== null ? this.agency.uuid : null, 
            imageLogo: this.data.imageLogo,
            imageHero: this.data.imageHero,
            colorPrimary: `#${this.data.colorPrimary}`,
            colorSecondary: `#${this.data.colorSecondary}`,
            colorAccent: `#${this.data.colorAccent}`,
            colorBackground: `#${this.data.colorBackground}`,
            colorSurface: `#${this.data.colorSurface}`,
            colorError: `#${this.data.colorError}`,
            colorSuccess: `#${this.data.colorSuccess}`
          },
          update: async (store, { data: { editAgencyTheme } }) => {
            if (editAgencyTheme.success)
              this.initialTheme = JSON.parse(JSON.stringify(this.$vuetify.theme.currentTheme));
            else
              this.forms.editAgencyTheme.errorMessage = editAgencyTheme.message;

            this.forms.editAgencyTheme.loading = false;
          }
        });
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
          theme {
            uuid
            name
            imageLogo
            imageHero
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

        this.initialTheme = JSON.parse(JSON.stringify(this.$vuetify.theme.currentTheme));
        this.data.colorPrimary = this.$vuetify.theme.currentTheme.primary.base.substr(1);
        this.data.colorSecondary = this.$vuetify.theme.currentTheme.secondary.base.substr(1);
        this.data.colorAccent = this.$vuetify.theme.currentTheme.accent.base.substr(1);
        this.data.colorBackground = this.$vuetify.theme.currentTheme.background.base.substr(1);
        this.data.colorSurface = this.$vuetify.theme.currentTheme.surface.base.substr(1);
        this.data.colorError = this.$vuetify.theme.currentTheme.error.base.substr(1);
        this.data.colorSuccess = this.$vuetify.theme.currentTheme.success.base.substr(1);

        return agency[0];
      },
      skip () {
        return this.$apollo.queries.session.loading;
      }
    }
  },
  beforeDestroy () {
    this.$vuetify.theme.themes[this.$vuetify.theme.dark ? 'dark' : 'light'] = this.initialTheme;
  }
};
</script>