<template>
  <v-container fluid class="pa-0 fill-height" id="profile-layout">
    <v-navigation-drawer v-model="drawer" app floating stateless :width="adjustSize(nested ? 400 : 300, 0.7)" class="d-flex flex-column flex-nowrap" color="surface darken-1">
      <v-row />
      <v-row no-gutters class="flex-column fill-height align-content-start">
        <v-navigation-drawer v-model="drawer" floating stateless :width="adjustSize(nested ? 180 : 300, 0.7)" class="d-flex flex-column flex-nowrap" color="surface darken-2">
          <v-row no-gutters align="center" class="flex-column fill-height flex-nowrap">
            <router-link to="/" v-if="$vuetify.breakpoint.smAndUp">
              <h1 class="f-4 font-weight-regular pa-2 mt-4 mb-2 surface--text text--lighten-4 text-center">duely</h1>
            </router-link>
            <slot name="menu">
            </slot>
          </v-row>
        </v-navigation-drawer>
        <v-row no-gutters class="align-self-start flex-column fill-height flex-nowrap">
          <slot name="sub-menu">
          </slot>
        </v-row>
      </v-row>
      <v-row />
    </v-navigation-drawer>

    <v-col class="content fill-height d-flex flex-row py-6 px-8">
      <slot></slot>
    </v-col>
  </v-container>
</template>

<script>
export default {
  computed: {
    nested() {
      return this.$slots['sub-menu'] && this.$slots['sub-menu'][0].children.some(v => v.tag !== undefined);
    }
  },
  data() {
    return {
      drawer: true
    };
  }
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