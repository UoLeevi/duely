<template>
  <v-container fluid class="pa-0 fill-height" id="profile-layout">
    <v-navigation-drawer v-if="$vuetify.breakpoint.smAndUp" v-model="drawer" app floating stateless :width="adjustSize(nested ? 400 : 300, 0.7)" class="d-flex flex-column flex-nowrap" color="surface darken-1">
      <v-row no-gutters class="flex-column fill-height align-content-start">
        <v-navigation-drawer v-model="drawer" floating stateless :width="adjustSize(nested ? 180 : 300, 0.7)" class="d-flex flex-column flex-nowrap" color="surface darken-2">
          <router-link to="/" v-if="$vuetify.breakpoint.smAndUp">
            <h1 class="f-4 font-weight-regular pa-2 mt-4 mb-2 surface--text text--lighten-4 text-center">duely</h1>
          </router-link>
          <v-row no-gutters fill-height align="center" class="flex-column fill-height flex-nowrap justify-center align-self-center" :class="{ 'pb-12': $vuetify.breakpoint.smAndUp }">
            <slot name="menu">
            </slot>
          </v-row>
        </v-navigation-drawer>
        <v-row no-gutters class="align-self-start flex-column fill-height flex-nowrap">
          <slot name="sub-menu">
          </slot>
        </v-row>
      </v-row>
    </v-navigation-drawer>
    <template v-else>
      <v-bottom-navigation v-model="drawer" app :height="nested ? 102 : 80" background-color="surface darken-1" class="d-flex flex-column">
        <v-row no-gutters class="flex-row flex-nowrap justify-start align-space-between align-self-center align-center" style="margin-bottom: 50px;">
          <slot name="sub-menu">
          </slot>
        </v-row>
      </v-bottom-navigation>
      <v-bottom-navigation v-model="drawer" app :height="nested ? 70 : 80" background-color="surface darken-2">
        <v-row no-gutters align="center" class="flex-row fill-height flex-nowrap justify-space-around align-space-between align-self-center">
          <slot name="menu">
          </slot>
        </v-row>
      </v-bottom-navigation>
    </template>
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