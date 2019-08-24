<template>
  <v-app :style="{'background-color': colorHex('background')}">
    <SplashScreenLoader :show="$root.graph.loading" />
    <v-content>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script>
import SplashScreenLoader from '@/components/SplashScreenLoader';

export default {
  name: 'App',
  components: {
    SplashScreenLoader
  }
}
</script>
