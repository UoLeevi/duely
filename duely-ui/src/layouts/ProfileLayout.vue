<template>
  <v-container fluid class="pa-0 fill-height" id="profile-layout">
    <v-col class="fill-height justify-center d-flex flex-column" cols="3" md="3">
      <v-row />
      <v-row align="center" class="flex-column fill-height">
        <router-link to="/" v-if="$vuetify.breakpoint.smAndUp">
          <h1 class="f-4 font-weight-regular pa-2 surface--text text--lighten-4">duely</h1>
        </router-link>
        <slot name="menu">
        </slot>
      </v-row>
      <v-row />
    </v-col>
    <v-col class="content fill-height d-flex flex-row py-6 px-8">
      <slot></slot>
    </v-col>
  </v-container>
</template>

<script>
export default {

};
</script>

<style scoped>
#profile-layout {
  background-color: var(--v-surface-darken2);
}

#profile-layout .content {
  background-color: white;
}

</style>