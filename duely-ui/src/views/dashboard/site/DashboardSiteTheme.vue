<template>
  <section>
    <h2 class="f-5b">Theme</h2>
    <v-fade-transition mode="out-in">
      <v-form @submit.prevent="submitEditAgencyTheme" ref="editAgencyThemeForm" v-model="forms.editAgencyTheme.valid">
        <FormPageRow>
          <FormPageCell heading="Service name" subheading="Name of the service">
            <v-text-field v-model="data.name" dense color="surface" background-color="background lighten-5" solo outlined flat single-line rounded label="Name" spellcheck="false" />
          </FormPageCell>
        </FormPageRow>

        <FormPageRow>
          <FormPageCell heading="Logo image" subheading="Optional logo of your service." column>
            <v-skeleton-loader v-if="$apollo.queries.agency.loading" type="image" height="120px" class="mt-auto mb-4" />
            <v-img v-else-if="data.imageLogo.data" :src="data.imageLogo.data" contain width="200px" class="py-1 my-auto" />
            <v-sheet v-else color="background lighten-4" height="120px" :class="`${ data.imageHero.data || data.imageLogo.data ? 'my-auto' : 'mt-auto mb-4' }`" class="d-flex justify-center">
              <v-icon large color="background lighten-3">image</v-icon>
            </v-sheet>
            <v-file-input v-model="data.imageLogo.file" show-size full-width label="Select image file" class="flex-grow-0 my-2 primary--text" :style="{ 'box-sizing': 'border-box' }" accept="image/*" :loading="data.imageLogo.loading" dense filled rounded append-icon="add_photo_alternate" prepend-icon="" />
          </FormPageCell>
          <FormPageCell heading="Hero image" subheading="Optional hero image will appear in the top part of the service landing page." column>
            <v-skeleton-loader v-if="$apollo.queries.agency.loading" type="image" height="120px" class="mt-auto mb-4" />
            <v-img v-else-if="data.imageHero.data" :src="data.imageHero.data" contain class="py-1 my-auto" />
            <v-sheet v-else color="background lighten-4" height="120px" :class="`${ data.imageHero.data || data.imageLogo.data ? 'my-auto' : 'mt-auto mb-4' }`" class="d-flex justify-center">
              <v-icon large color="background lighten-3">image</v-icon>
            </v-sheet>
            <v-file-input v-model="data.imageHero.file" show-size full-width label="Select image file" class="flex-grow-0 my-2 primary--text" :style="{ 'box-sizing': 'border-box' }" accept="image/*" :loading="data.imageHero.loading" dense filled rounded append-icon="add_photo_alternate" prepend-icon="" />
          </FormPageCell>
        </FormPageRow>

        <FormPageRow>
          <FormPageCell heading="Primary color" subheading="Primary color is the color displayed most frequently across your app’s screens and components." column :width="300">
            <v-color-picker v-model="data.colorPrimary" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </FormPageCell>
          <FormPageCell heading="Secondary color" subheading="Secondary color provides more ways to accent and distinguish your product." column :width="300">
            <v-color-picker v-model="data.colorSecondary" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </FormPageCell>
          <FormPageCell heading="Accent color" subheading="Accent color is used for small elements to provide variation to color scheme." column :width="300">
            <v-color-picker v-model="data.colorAccent" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </FormPageCell>
          <FormPageCell heading="Background color" subheading="The background color appears behind scrollable content." column :width="300">
            <v-color-picker v-model="data.colorBackground" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </FormPageCell>
          <FormPageCell heading="Surface color" subheading="Surface colors affect surfaces of components, such as cards, sheets, and menus." column :width="300">
            <v-color-picker v-model="data.colorSurface" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </FormPageCell>
          <FormPageCell heading="Error color" subheading="Error color indicates errors in components, such as invalid text in a text field." column :width="300">
            <v-color-picker v-model="data.colorError" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </FormPageCell>
          <FormPageCell heading="Success color" subheading="Success color can be used to indicate valid data or successful completion." column :width="300">
            <v-color-picker v-model="data.colorSuccess" :canvas-height="120" flat mode="hexa" class="mt-auto" :style="{ 'background-color': colorHex('background lighten-5') }" />
          </FormPageCell>
        </FormPageRow>

        <v-expand-transition>
          <p class="error--text" v-if="forms.editAgencyTheme.errorMessage">{{ forms.editAgencyTheme.errorMessage }}</p>
        </v-expand-transition>
        <v-row class="ml-6 pt-2 pb-1">
          <v-btn :min-width="100" depressed rounded :loading="loading > 0" :disabled="!forms.editAgencyTheme.valid" type="submit" color="primary" class="text-none mr-4" >Save</v-btn>
          <v-btn :min-width="100" text depressed rounded class="text-none" to="/dashboard/site">Cancel</v-btn>
        </v-row>
        <v-snackbar v-model="snackbar" bottom right :timeout="2000" color="surface darken-2" class="success--text"><span class="f-2b">Theme saved.</span></v-snackbar>
      </v-form>
    </v-fade-transition>
  </section>
</template>

<script>
import { gql } from '@/apollo';
import FormPageCell from '@/components/FormPageCell';
import FormPageRow from '@/components/FormPageRow';

export default {
  components: {
    FormPageCell,
    FormPageRow
  },
  data(vm) {
    return {
      loading: 0,
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
          valid: true
        }
      },
      snackbar: false
    };
  },
  watch: {
    async 'data.imageLogo.file'(file) {
      try {
        this.loading++;
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
          this.loading--;
        };
        reader.onerror = error => {
          this.data.imageLogo.uuid = null;
          this.data.imageLogo.data = null;
          this.data.imageLogo.loading = false;
          this.loading--;
          this.data.imageLogo.error = error.message;
        };
      } catch (err) {
        this.data.imageLogo.uuid = null;
        this.data.imageLogo.data = null;
        this.data.imageLogo.loading = false;
        this.loading--;
        this.data.imageLogo.error = err.message;
      }
    },
    async 'data.imageHero.file'(file) {
      try {
        this.loading++;
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
          this.loading--;
        };
        reader.onerror = error => {
          this.data.imageHero.uuid = null;
          this.data.imageHero.data = null;
          this.data.imageHero.loading = false;
          this.loading--;
          this.data.imageHero.error = error.message;
        };
      } catch (err) {
        this.data.imageHero.uuid = null;
        this.data.imageHero.data = null;
        this.data.imageHero.loading = false;
        this.loading--;
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
      this.loading++;
      image.loading = true;
      await this.$apollo.mutate({
        mutation: gql`mutation($agencyUuid: ID!, $imageName: String!, $imageData: String!, $imageColor: String!) {
          editImage(agencyUuid: $agencyUuid, imageName: $imageName, imageData: $imageData, imageColor: $imageColor) {
            success
            message
            image {
              uuid
            }
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
            image.uuid = editImage.image.uuid;
          else
            image.errorMessage = editImage.message;

          image.loading = false;
          this.loading--;
        }
      });
    },
    async submitEditAgencyTheme() {
      this.forms.editAgencyTheme.errorMessage = null;

      if (this.$refs.editAgencyThemeForm.validate()) {
        this.loading++;

        try {
          if (this.data.imageLogo.uuid === null && this.data.imageLogo.data !== null)
            await this.editImage(this.data.imageLogo);

          if (this.data.imageHero.uuid === null && this.data.imageHero.data !== null)
            await this.editImage(this.data.imageHero);

          await this.$apollo.mutate({
            mutation: gql`mutation($agencyUuid: ID!, $imageLogoUuid: ID, $imageHeroUuid: ID, $colorPrimary: String!, $colorSecondary: String!, $colorAccent: String!, $colorBackground: String!, $colorSurface: String!, $colorError: String!, $colorSuccess: String!) {
              editAgencyTheme(agencyUuid: $agencyUuid, imageLogoUuid: $imageLogoUuid, imageHeroUuid: $imageHeroUuid, colorPrimary: $colorPrimary, colorSecondary: $colorSecondary, colorAccent: $colorAccent, colorBackground: $colorBackground, colorSurface: $colorSurface, colorError: $colorError, colorSuccess: $colorSuccess) {
                success
                message
                theme {
                  uuid
                }
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

              this.loading--;
            }
          });
        } catch (error) {
            this.forms.editAgencyTheme.errorMessage = error.message;
            this.loading--;
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

          if (this.data.imageLogo.file === null && theme.imageLogo !== null) {
            this.data.imageLogo.uuid = theme.imageLogo.uuid;
            this.data.imageLogo.data = theme.imageLogo.data;
            this.data.imageLogo.color = theme.imageLogo.color;
          }

          if (this.data.imageHero.file === null && theme.imageHero !== null) {
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
