<template>
  <v-app v-custom-scroll :class="`${this.$vuetify.breakpoint.name}`">
    <ScrollNav />
    <SplashScreenLoader :show="$vgraph.loading" />
    <v-content>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script>
import ScrollNav from '@/vutil/components/ScrollNav';
import SplashScreenLoader from '@/components/SplashScreenLoader';

export default {
  name: 'App',
  components: {
    SplashScreenLoader,
    ScrollNav
  }
}
</script>

<style scoped>
#app {
  background-color: var(--v-background-base);
}
</style>
