<template>
  <v-container fluid class="pa-0 fill-height" id="dashboard-layout" v-background-color="'grey lighten-5'">
    <v-navigation-drawer v-model="drawer" fixed app floating stateless :width="adjustSize(100, 0.3)" class="justify-center d-flex flex-column" color="grey darken-4">
      <v-row />
      <v-row align="center" class="flex-column fill-height">
        <slot name="menu">
        </slot>
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
  data() {
    return {
      drawer: true
    };
  }
};
</script>

<style scoped>
#dashboard-layout .content {
  background-color: var(--v-grey-lighten5);
}

</style>