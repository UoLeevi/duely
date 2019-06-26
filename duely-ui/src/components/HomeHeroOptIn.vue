<template>
  <v-card class="hero-opt-in mt-4 pa-4" flat :dark="dark" color="transparent" height="800px">
    <v-card-title primary-title>
      <h2 class="display-2">
        Offer and manage
        <br>your services online
      </h2>
      <p class="headline my-4">
        With
        <b>duely</b>, you have can sell your services and manage your client deliverables through flexible and easy to use sevice platform.
      </p>
      <v-form @submit.prevent="submit" class="my-3">
        <v-text-field
          label="email"
          type="email"
          spellcheck="false"
          class="font-weight-bold"
          v-model="email"
          light
          background-color="accent lighten-2"
          solo
          flat
          single-line
          hide-details
          rounded
        >
          <template #append>
            <v-btn
              type="submit"
              class="text-none"
              large
              depressed
              rounded
              color="primary"
              :to="`/create-account?email=${email}`"
            >Get started</v-btn>
          </template>
        </v-text-field>
      </v-form>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: {
    dark: Boolean
  },
  data() {
    return {
      email: ""
    };
  },
  methods: {
    submit() {

    }
  }
};
</script>

<style>
.hero-opt-in {
  max-width: 640px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-opt-in .v-form {
  max-width: 500px;
}

.hero-opt-in .v-text-field--rounded .v-input__slot {
  padding-right: 0 !important;
}
</style>
