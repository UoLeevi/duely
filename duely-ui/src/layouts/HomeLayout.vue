<template>
  <v-container fluid class="pa-0" id="home-layout">
    <slot name="app-bar"><HomeAppBar/></slot>
    <slot></slot>
  </v-container>
</template>

<script>
import HomeAppBar from '@/components/HomeAppBar';

export default {
  components: {
    HomeAppBar
  }
};
</script>