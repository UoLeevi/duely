<template>
  <v-container fluid class="pa-0 fill-height" id="dashboard-layout">
    <v-navigation-drawer v-model="drawer" app floating stateless :width="adjustSize(nested ? 200 : 100, 0.3)" class="d-flex flex-column flex-nowrap" color="surface darken-1">
      <v-row />
      <v-row no-gutters class="flex-column fill-height align-content-start">
        <v-navigation-drawer v-model="drawer" floating stateless :width="adjustSize(nested ? 70 : 100, 0.3)" class="d-flex flex-column flex-nowrap" color="surface darken-2">
          <v-row no-gutters align="center" class="flex-column fill-height flex-nowrap">
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
#dashboard-layout .content {
  background-color: var(--v-background-lighten5);
}

</style>