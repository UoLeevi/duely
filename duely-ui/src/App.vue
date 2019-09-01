<template>
  <v-app :style="{'background-color': colorHex('background')}">
    <ScrollNav />
    <SplashScreenLoader :show="$root.graph.loading" />
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
