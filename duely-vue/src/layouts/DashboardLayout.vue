<template>
  <div>
    <v-navigation-drawer app floating dark v-model="drawer">
      <div v-show="$vuetify.breakpoint.mdAndDown" class="headline ml-4"
       :style="{ 'height': '64px', 'display': 'flex', 'align-items': 'center' }">
        <h3 class="logo-text">duely</h3>
      </div>
    </v-navigation-drawer>

    <v-toolbar app flat color="accent lighten-5">
      <v-toolbar-side-icon flat color="accent lighten-1" @click="drawer = !drawer" />
      <v-toolbar-title class="headline">
        <h3 class="logo-text">duely</h3>
      </v-toolbar-title>
    </v-toolbar>

    <v-fade-transition mode="out-in">
      <slot></slot>
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drawer: false
    }
  }
}
</script>

<style>
#app {
  background-color: var(--v-accent-lighten5);
}

.logo-text {
  color: var(--v-primary-base);
  letter-spacing: 0.01em;
}
</style>
