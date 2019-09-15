<template>
  <section class="profile-create-agency">
    <h2 class="f-5b">Create new agency</h2>
    <v-stepper v-model="step" vertical class="elevation-0" :style="{'width': `${adjustSize(600, 0.7)}px`}">

      <v-stepper-step :complete="step > 1" step="1">
        Name your agency
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-form @submit.prevent="submitCreateAgencyStep1" ref="createAgencyStep1Form" v-model="forms.createAgencyStep1.valid">
          <v-col class="pt-1">
            <v-text-field class="mt-0 mb-1" solo outlined flat single-line rounded v-model="data.name" :rules="rules.name" label="Agency name" spellcheck="false" validate-on-blur></v-text-field>
            <v-text-field class="mt-1 mb-1" suffix=".duely.app" :hint="'Your agency will have a subdomain for duely.app'" solo outlined flat single-line persistent-hint rounded v-model="data.subdomain" :rules="rules.subdomain" label="Subdomain name" spellcheck="false"></v-text-field>
          </v-col>
          <v-expand-transition>
            <p class="error--text" v-if="forms.createAgencyStep1.errorMessage">{{ forms.createAgencyStep1.errorMessage }}</p>
          </v-expand-transition>
          <v-row class="ml-3 mt-1 mb-1">
            <v-btn depressed rounded :loading="forms.createAgencyStep1.loading" :disabled="!forms.createAgencyStep1.valid" type="submit" color="primary" class="text-none mr-4">Create agency</v-btn>
            <v-btn text depressed rounded class="text-none" to="/profile">Cancel</v-btn>
          </v-row>
        </v-form>
      </v-stepper-content>

    </v-stepper>
  </section>
</template>

<script>
import { client, gql } from '@/apollo';

export default {
  data() {
    return {
      step: 1,
      data: {
        name: '',
        subdomain: ''
      },
      rules: {
        name: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 70) || 'Name must be at most 70 characters'
        ],
        subdomain: [
          v => !!v || 'Subdomain name is required',
          // eslint-disable-next-line 
          v => this.isSubdomainNameValid || 'Invalid subdomain name'
        ]
      },
      forms: {
        createAgencyStep1: {
          errorMessage: null,
          loading: false,
          valid: false
        }
      },
      terms: false,
      conditions: false
    };
  },
  computed: {
    isSubdomainNameValid() {
      const reservedSubdomains = ['api', 'test', 'example', 'admin'];

      if (reservedSubdomains.includes(this.data.subdomain.toLowerCase()))
        return false;

      if (this.data.subdomain.includes('.'))
        return false;

      return /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$)/.test(`${this.data.subdomain}.duely.app`);
    }
  },
  methods: {
    async submitCreateAgencyStep1() {
      this.forms.createAgencyStep1.errorMessage = null;

      if (this.$refs.createAgencyStep1Form.validate()) {
        this.forms.createAgencyStep1.loading = true;

        const res = await client.mutate({
          mutation: gql`
            mutation($name: String!, $subdomain: String!) {
              createAgency(name: $name, subdomain: $subdomain) {
                success
                message
                agencyUuid
              }
            }
          `,
          variables: {
            name: this.data.name,
            subdomain: this.data.subdomain
          },
          refetchQueries: [{
            query: gql`
              query {
                me {
                  uuid
                  agenciesConnection {
                    edges {
                      cursor
                      roles
                      node {
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
            `
          }],
          awaitRefetchQueries: true
        });

        if (res.data.createAgency.success) 
          this.$router.push({ path: '/profile/agencies' });
        else
          this.forms.createAgencyStep1.errorMessage =
            res.data.createAgency.message;

        this.forms.createAgencyStep1.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.profile-create-agency {
  width: 100%;
}
</style>
