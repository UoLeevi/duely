<template>
  <section>
    <h2 class="f-5b">Theme</h2>
    <v-fade-transition mode="out-in">
      <v-progress-circular v-if="$apollo.loading" />
      <v-form v-else @submit.prevent="submitEditAgencyTheme" ref="editAgencyThemeForm" v-model="forms.editAgencyTheme.valid">
        <v-row class="pt-1 px-4 flex-wrap">
          <div class="d-flex flex-column pa-6" :style="{ 'width': `${ adjustSize(400, 0.5) }px` }">
            <span class="f-3b surface--text text--lighten2">Logo image</span>
            <p class="f-2 pt-1 background--text text--darken3">Logo of your agency.</p>
            <v-img class="py-1" v-if="data.imageLogo.data" :src="data.imageLogo.data" contain width="200px" />
            <v-file-input v-model="data.imageLogo.file" show-size full-width label="Select image file" class="mt-auto flex-grow-0 mb-2 primary--text" accept="image/*" :loading="data.imageLogo.loading" dense filled rounded :rules="rules.image" validate-on-blur append-icon="add_photo_alternate" prepend-icon="" />
          </div>
          <div class="d-flex flex-column pa-6" :style="{ 'width': `${ adjustSize(400, 0.5) }px` }">
            <span class="f-3b surface--text text--lighten2">Hero image</span>
            <p class="f-2 pt-1 background--text text--darken3">This image will appear in the agency card in your profile.</p>
            <v-img class="py-1" v-if="data.imageHero.data" :src="data.imageHero.data" contain />
            <v-file-input v-model="data.imageHero.file" show-size full-width label="Select image file" class="mt-auto flex-grow-0 mb-2 primary--text" accept="image/*" :loading="data.imageHero.loading" dense filled rounded :rules="rules.image" validate-on-blur append-icon="add_photo_alternate" prepend-icon="" />
          </div>
        </v-row>
        <v-row class="pt-1 px-4 flex-wrap">
          <div class="d-flex flex-column pa-6" :style="{ 'width': `${ adjustSize(400, 0.5) }px` }">
            <span class="f-3b surface--text text--lighten2">Primary color</span>
            <p class="f-2 pt-1 background--text text--darken3">Primary color is the color displayed most frequently across your app’s screens and components.</p>
            <v-color-picker v-model="data.colorPrimary" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </div>
          <div class="d-flex flex-column pa-6" :style="{ 'width': `${ adjustSize(400, 0.5) }px` }">
            <span class="f-3b surface--text text--lighten2">Secondary color</span>
            <p class="f-2 pt-1 background--text text--darken3">Secondary color provides more ways to accent and distinguish your product.</p>
            <v-color-picker v-model="data.colorSecondary" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </div>
          <div class="d-flex flex-column pa-6" :style="{ 'width': `${ adjustSize(400, 0.5) }px` }">
            <span class="f-3b surface--text text--lighten2">Accent color</span>
            <p class="f-2 pt-1 background--text text--darken3">Accent color is used for small elements to provide variation to color scheme.</p>
            <v-color-picker v-model="data.colorAccent" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </div>
          <div class="d-flex flex-column pa-6" :style="{ 'width': `${ adjustSize(400, 0.5) }px` }">
            <span class="f-3b surface--text text--lighten2">Background color</span>
            <p class="f-2 pt-1 background--text text--darken3">The background color appears behind scrollable content.</p>
            <v-color-picker v-model="data.colorBackground" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </div>
          <div class="d-flex flex-column pa-6" :style="{ 'width': `${ adjustSize(400, 0.5) }px` }">
            <span class="f-3b surface--text text--lighten2">Surface color</span>
            <p class="f-2 pt-1 background--text text--darken3">Surface colors affect surfaces of components, such as cards, sheets, and menus.</p>
            <v-color-picker v-model="data.colorSurface" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </div>
          <div class="d-flex flex-column pa-6" :style="{ 'width': `${ adjustSize(400, 0.5) }px` }">
            <span class="f-3b surface--text text--lighten2">Error color</span>
            <p class="f-2 pt-1 background--text text--darken3">Error color indicates errors in components, such as invalid text in a text field.</p>
            <v-color-picker v-model="data.colorError" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </div>
          <div class="d-flex flex-column pa-6" :style="{ 'width': `${ adjustSize(400, 0.5) }px` }">
            <span class="f-3b surface--text text--lighten2">Success color</span>
            <p class="f-2 pt-1 background--text text--darken3">Success color can be used to indicate valid data or successful completion.</p>
            <v-color-picker v-model="data.colorSuccess" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </div>
        </v-row>
        <v-expand-transition>
          <p class="error--text" v-if="forms.editAgencyTheme.errorMessage">{{ forms.editAgencyTheme.errorMessage }}</p>
        </v-expand-transition>
        <v-row class="ml-3 pt-2 pb-1">
          <v-btn :min-width="100" depressed rounded :loading="forms.editAgencyTheme.loading" :disabled="!forms.editAgencyTheme.valid" type="submit" color="primary" class="text-none mr-4" >Save</v-btn>
          <v-btn :min-width="100" text depressed rounded class="text-none" to="/dashboard/site">Cancel</v-btn>
        </v-row>
        <v-snackbar v-model="snackbar" bottom right :timeout="2000" color="surface darken-2" class="success--text"><span class="f-2b">Theme saved.</span></v-snackbar>
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
        imageLogo: { uuid: null, name: 'logo', color: null, file: null, data: null, loading: false, errorMessage: null },
        imageHero: { uuid: null, name: 'hero', color: null, file: null, data: null, loading: false, errorMessage: null },
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
          v => /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(v) || 'Hexadecimal color code is expected',
        ],
        image: [
          () => true
        ]
      },
      forms: {
        editAgencyTheme: {
          errorMessage: null,
          loading: false,
          valid: true
        }
      },
      snackbar: false
    };
  },
  watch: {
    async 'data.imageLogo.file'(file) {
      try {
        this.data.imageLogo.loading = true;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => { 
          this.data.imageLogo.data = reader.result;
          this.data.imageLogo.uuid = null;
          this.data.imageLogo.error = null;
          try {
            this.data.imageLogo.color = await this.estimateImageColor(this.data.imageLogo.data);
          } catch {
            this.data.imageLogo.color = '#000000';
          }
          this.data.imageLogo.loading = false;
        };
        reader.onerror = error => {
          this.data.imageLogo.uuid = null;
          this.data.imageLogo.data = null;
          this.data.imageLogo.loading = false;
          this.data.imageLogo.error = error.message;
        };
      } catch (err) {
        this.data.imageLogo.uuid = null;
        this.data.imageLogo.data = null;
        this.data.imageLogo.loading = false;
        this.data.imageLogo.error = err.message;
      }
    },
    async 'data.imageHero.file'(file) {
      try {
        this.data.imageHero.loading = true;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => { 
          this.data.imageHero.data = reader.result;
          this.data.imageHero.uuid = null;
          this.data.imageHero.error = null;
          try {
            this.data.imageHero.color = await this.estimateImageColor(this.data.imageHero.data);
          } catch {
            this.data.imageHero.color = '#000000';
          }
          this.data.imageHero.loading = false;
        };
        reader.onerror = error => {
          this.data.imageHero.uuid = null;
          this.data.imageHero.data = null;
          this.data.imageHero.loading = false;
          this.data.imageHero.error = error.message;
        };
      } catch (err) {
        this.data.imageHero.uuid = null;
        this.data.imageHero.data = null;
        this.data.imageHero.loading = false;
        this.data.imageHero.error = err.message;
      }
    },
    'data.colorPrimary'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('primary', color);
    },
    'data.colorSecondary'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('secondary', color);
    },
    'data.colorAccent'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('accent', color);
    },
    'data.colorBackground'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('background', color);
    },
    'data.colorSurface'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('surface', color);
    },
    'data.colorError'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('error', color);
    },
    'data.colorSuccess'(color) {
      if (this.rules.color.every(r => r(color) === true))
        this.updateThemeItem('success', color);
    }
  },
  methods: {
    async editImage(image) {
        image.loading = true;
        await this.$apollo.mutate({
          mutation: gql`mutation($agencyUuid: ID!, $imageName: String!, $imageData: String!, $imageColor: String!) {
            editImage(agencyUuid: $agencyUuid, imageName: $imageName, imageData: $imageData, imageColor: $imageColor) {
              success
              message
              imageUuid
            }
          }`,
          variables: {
            agencyUuid: this.agency !== null ? this.agency.uuid : null, 
            imageName: image.name,
            imageData: image.data,
            imageColor: image.color
          },
          update: (store, { data: { editImage } }) => {
            if (editImage.success)
              image.uuid = editImage.imageUuid;
            else
              image.errorMessage = editImage.message;

            image.loading = false;
          }
        });
    },
    async submitEditAgencyTheme() {
      this.forms.editAgencyTheme.errorMessage = null;

      if (this.$refs.editAgencyThemeForm.validate()) {
        this.forms.editAgencyTheme.loading = true;

        try {
          if (this.data.imageLogo.uuid === null)
            await this.editImage(this.data.imageLogo);

          if (this.data.imageHero.uuid === null)
            await this.editImage(this.data.imageHero);

          await this.$apollo.mutate({
            mutation: gql`mutation($agencyUuid: ID!, $imageLogoUuid: ID!, $imageHeroUuid: ID!, $colorPrimary: String!, $colorSecondary: String!, $colorAccent: String!, $colorBackground: String!, $colorSurface: String!, $colorError: String!, $colorSuccess: String!) {
              editAgencyTheme(agencyUuid: $agencyUuid, imageLogoUuid: $imageLogoUuid, imageHeroUuid: $imageHeroUuid, colorPrimary: $colorPrimary, colorSecondary: $colorSecondary, colorAccent: $colorAccent, colorBackground: $colorBackground, colorSurface: $colorSurface, colorError: $colorError, colorSuccess: $colorSuccess) {
                success
                message
                themeUuid
              }
            }`,
            variables: {
              agencyUuid: this.agency !== null ? this.agency.uuid : null, 
              imageLogoUuid: this.data.imageLogo.uuid,
              imageHeroUuid: this.data.imageHero.uuid,
              colorPrimary: this.data.colorPrimary,
              colorSecondary: this.data.colorSecondary,
              colorAccent: this.data.colorAccent,
              colorBackground: this.data.colorBackground,
              colorSurface: this.data.colorSurface,
              colorError: this.data.colorError,
              colorSuccess: this.data.colorSuccess
            },
            update: (store, { data: { editAgencyTheme } }) => {
              if (editAgencyTheme.success) {
                this.initialTheme = JSON.parse(JSON.stringify(this.$vuetify.theme.currentTheme));
                this.snackbar = true;
              } else
                this.forms.editAgencyTheme.errorMessage = editAgencyTheme.message;

              this.forms.editAgencyTheme.loading = false;
            }
          });
        } catch (error) {
            this.forms.editAgencyTheme.errorMessage = error.message;
            this.forms.editAgencyTheme.loading = false;
        }
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
      update ({ agency }) {
        const theme = agency.theme;
        
        if (theme) {
          this.updateThemeItem('primary', theme.colorPrimary);
          this.updateThemeItem('secondary', theme.colorSecondary);
          this.updateThemeItem('accent', theme.colorAccent);
          this.updateThemeItem('background', theme.colorBackground);
          this.updateThemeItem('surface', theme.colorSurface);
          this.updateThemeItem('error', theme.colorError);
          this.updateThemeItem('success', theme.colorSuccess);

          if (this.data.imageLogo.file === null) {
            this.data.imageLogo.uuid = theme.imageLogo.uuid;
            this.data.imageLogo.data = theme.imageLogo.data;
            this.data.imageLogo.color = theme.imageLogo.color;
          }

          if (this.data.imageHero.file === null) {
            this.data.imageHero.uuid = theme.imageHero.uuid;
            this.data.imageHero.data = theme.imageHero.data;
            this.data.imageHero.color = theme.imageHero.color;
          }
        }

        this.initialTheme = JSON.parse(JSON.stringify(this.$vuetify.theme.currentTheme));

        this.data.colorPrimary = this.$vuetify.theme.currentTheme.primary.base;
        this.data.colorSecondary = this.$vuetify.theme.currentTheme.secondary.base;
        this.data.colorAccent = this.$vuetify.theme.currentTheme.accent.base;
        this.data.colorBackground = this.$vuetify.theme.currentTheme.background.base;
        this.data.colorSurface = this.$vuetify.theme.currentTheme.surface.base;
        this.data.colorError = this.$vuetify.theme.currentTheme.error.base;
        this.data.colorSuccess = this.$vuetify.theme.currentTheme.success.base;

        return agency;
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