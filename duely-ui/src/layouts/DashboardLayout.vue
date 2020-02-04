<template>
  <v-container fluid class="pa-0 fill-height" id="dashboard-layout">
    <v-navigation-drawer v-if="$vuetify.breakpoint.smAndUp" v-model="drawer" app floating stateless :width="adjustSize(nested ? 200 : 100, 0.3)" class="d-flex flex-column flex-nowrap" color="surface darken-1">
      <v-row no-gutters class="flex-column fill-height align-content-start">
        <v-navigation-drawer v-model="drawer" floating stateless :width="adjustSize(nested ? 70 : 100, 0.3)" class="d-flex flex-column flex-nowrap" color="surface darken-2">
          <v-row no-gutters align="center" class="flex-column fill-height flex-nowrap justify-center align-self-center">
            <slot name="menu">
            </slot>
          </v-row>
        </v-navigation-drawer>
        <v-row no-gutters class="align-self-start flex-column fill-height flex-nowrap mt-6 ml-2">
          <slot name="sub-menu">
          </slot>
        </v-row>
      </v-row>
    </v-navigation-drawer>
    <template v-else>
      <v-bottom-navigation v-model="drawer" app :height="nested ? 82 : 60" background-color="surface darken-1" class="d-flex flex-column">
        <v-row no-gutters class="flex-row flex-nowrap justify-start align-space-between align-self-center align-center" style="margin-bottom: 50px;">
          <slot name="sub-menu">
          </slot>
        </v-row>
      </v-bottom-navigation>
      <v-bottom-navigation v-model="drawer" app :height="nested ? 50 : 60" background-color="surface darken-2">
        <v-row no-gutters align="center" class="flex-row fill-height flex-nowrap justify-space-around align-space-between align-self-center">
          <slot name="menu">
          </slot>
        </v-row>
      </v-bottom-navigation>
    </template>
    <v-col class="content fill-height d-flex flex-row flex-wrap py-6 px-8">
      <slot></slot>
    </v-col>
  </v-container>
</template>

<script>
export default {
  computed: {
    nested() {
      return this.$slots['sub-menu'] && this.$slots['sub-menu'].some(v => v.tag !== undefined);
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
#dashboard-layout .content {
  background-color: var(--v-background-lighten5);
  overflow: auto;
}

</style>