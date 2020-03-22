<template>
  <section style="width: 100%;">
    <h2 class="f-5b">{{ $apollo.queries.service.loading ? '' : service.name }}</h2>
    <FormPageRow>
      <FormPageCell heading="Service name" subheading="Name of the service">
        <v-text-field v-model="data.name" dense color="surface" background-color="background lighten-5" solo outlined flat single-line rounded label="Name" spellcheck="false" />
      </FormPageCell>
    </FormPageRow>

    <FormPageRow>
      <FormPageCell heading="Description" subheading="More detailed information about the service.">
        <!-- <MarkdownArea :markdown.sync="data.description" edit /> -->
        <TextEditor :text="data.description" />
      </FormPageCell>
    </FormPageRow>

    <FormPageRow>
      <FormPageCell heading="Price" subheading="Price and the currency of the service.">
        <v-text-field v-model="data.price" dense color="surface" background-color="background lighten-5" solo outlined flat single-line rounded class="my-1" label="Price" spellcheck="false" />
        <v-text-field v-model="data.currency" dense color="surface" background-color="background lighten-5" solo outlined flat single-line rounded class="my-1" label="Currency" spellcheck="false" />
      </FormPageCell>
      <FormPageCell heading="Duration" subheading="Total duration of the service delivery.">
        <v-text-field v-model="data.duration" dense color="surface" background-color="background lighten-5" solo outlined flat single-line rounded class="my-1" label="Duration" spellcheck="false" />
      </FormPageCell>
    </FormPageRow>

    <FormPageRow>
      <FormPageCell heading="Logo image" subheading="Optional logo of your service." column>
        <v-skeleton-loader v-if="$apollo.queries.service.loading" type="image" height="120px" class="mt-auto mb-4" />
        <v-img v-else-if="data.imageLogo.data" :src="data.imageLogo.data" contain width="200px" class="py-1 my-auto" />
        <v-sheet v-else color="background lighten-4" height="120px" :class="`${ data.imageHero.data || data.imageLogo.data ? 'my-auto' : 'mt-auto mb-4' }`" class="d-flex justify-center">
          <v-icon large color="background lighten-3">image</v-icon>
        </v-sheet>
        <v-file-input v-model="data.imageLogo.file" show-size full-width label="Select image file" class="flex-grow-0 my-2 primary--text" :style="{ 'box-sizing': 'border-box' }" accept="image/*" :loading="data.imageLogo.loading" dense filled rounded append-icon="add_photo_alternate" prepend-icon="" />
      </FormPageCell>
      <FormPageCell heading="Hero image" subheading="Optional hero image will appear in the top part of the service landing page." column>
        <v-skeleton-loader v-if="$apollo.queries.service.loading" type="image" height="120px" class="mt-auto mb-4" />
        <v-img v-else-if="data.imageHero.data" :src="data.imageHero.data" contain class="py-1 my-auto" />
        <v-sheet v-else color="background lighten-4" height="120px" :class="`${ data.imageHero.data || data.imageLogo.data ? 'my-auto' : 'mt-auto mb-4' }`" class="d-flex justify-center">
          <v-icon large color="background lighten-3">image</v-icon>
        </v-sheet>
        <v-file-input v-model="data.imageHero.file" show-size full-width label="Select image file" class="flex-grow-0 my-2 primary--text" :style="{ 'box-sizing': 'border-box' }" accept="image/*" :loading="data.imageHero.loading" dense filled rounded append-icon="add_photo_alternate" prepend-icon="" />
      </FormPageCell>
    </FormPageRow>

    <v-expand-transition>
      <p class="error--text" v-if="errorMessage">{{ errorMessage }}</p>
    </v-expand-transition>
    <v-row class="ml-6 pt-2 pb-1">
      <v-btn :min-width="100" depressed rounded :loading="loading > 0" @click="submitEditService" color="primary" class="text-none mr-4" >Save</v-btn>
      <v-btn :min-width="100" text depressed rounded class="text-none" to="/dashboard/services">Cancel</v-btn>
    </v-row>
  </section>
</template>

<script>
import { gql } from '@/apollo';
//import MarkdownArea from '@/components/MarkdownArea';
import TextEditor from '@/components/TextEditor';
import FormPageCell from '@/components/FormPageCell';
import FormPageRow from '@/components/FormPageRow';

export default {
  components: {
    // MarkdownArea,
    TextEditor,
    FormPageCell,
    FormPageRow
  },
  data() {
    return {
      loading: 0,
      errorMessage: null,
      data: {
        name: '',
        description: null,
        duration: null,
        price: null,
        currency: null,
        imageLogo: { uuid: null, name: 'service-logo', color: null, file: null, data: null, loading: false, errorMessage: null },
        imageHero: { uuid: null, name: 'service-hero', color: null, file: null, data: null, loading: false, errorMessage: null }
      }
    };
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
          agencyUuid: this.service !== null ? this.service.agency.uuid : null, 
          imageName: `${image.name}_${this.service !== null ? this.service.uuid : ''}`,
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
    async submitEditService() {
      this.errorMessage = null;
      this.loading++;

      try {
        if (this.data.imageLogo.uuid === null && this.data.imageLogo.data !== null)
          await this.editImage(this.data.imageLogo);

        if (this.data.imageHero.uuid === null && this.data.imageHero.data !== null)
          await this.editImage(this.data.imageHero);

        await this.$apollo.mutate({
          mutation: gql`mutation($serviceUuid: ID!, $name: String!, $description: String, $duration: String, $price: Int, $currency: String, $imageLogoUuid: ID, $imageHeroUuid: ID) {
            editService(serviceUuid: $serviceUuid, name: $name, description: $description, duration: $duration, price: $price, currency: $currency, imageLogoUuid: $imageLogoUuid, imageHeroUuid: $imageHeroUuid) {
              success
              message
              service {
                uuid
                name
                status
                description
                price
                currency
                duration
                steps {
                  uuid
                  name
                  type
                }
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
              }
            }
          }`,
          variables: {
            serviceUuid: this.service !== null ? this.service.uuid : null,
            name: this.data.name,
            description: this.data.description,
            duration: this.data.duration,
            price: this.data.price,
            currency: this.data.currency,
            imageLogoUuid: this.data.imageLogo.uuid,
            imageHeroUuid: this.data.imageHero.uuid
          },
          update: (store, { data: { editService } }) => {
            if (editService.success) {
              this.initialTheme = JSON.parse(JSON.stringify(this.$vuetify.theme.currentTheme));
              this.snackbar = true;
            } else
              this.errorMessage = editService.message;

            this.loading--;
          }
        });
      } catch (error) {
          this.errorMessage = error.message;
          this.loading--;
      }
    }
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
    }
  },
  apollo: {
    service: {
      query: gql`
        query($uuid: ID!) {
          service(uuid: $uuid) {
            uuid
            name
            status
            description
            price
            currency
            duration
            steps {
              uuid
              name
              type
            }
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
            agency {
              uuid
            }
          }
        }
      `,
      variables() {
        return {
          uuid: this.$route.params.uuid
        };
      },
      update({ service }) {
        this.data.name = service.name;
        this.data.description = service.description;
        this.data.duration = service.duration;
        this.data.price = service.price;
        this.data.currency = service.currency;

        if (this.data.imageLogo.file === null && service.imageLogo !== null) {
          this.data.imageLogo.uuid = service.imageLogo.uuid;
          this.data.imageLogo.data = service.imageLogo.data;
          this.data.imageLogo.color = service.imageLogo.color;
        }

        if (this.data.imageHero.file === null && service.imageHero !== null) {
          this.data.imageHero.uuid = service.imageHero.uuid;
          this.data.imageHero.data = service.imageHero.data;
          this.data.imageHero.color = service.imageHero.color;
        }

        return service;
      }
    }
  }
};
</script>
