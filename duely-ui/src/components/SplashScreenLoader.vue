<template>
  <v-dialog :value="show" persistent fullscreen content-class="initializing-dialog" transition="fade-transition">
    <v-container fill-height>
      <v-layout row justify-center align-center>
        <v-progress-circular indeterminate :size="70" :width="7" color="grey lighten-4" />
      </v-layout>
    </v-container>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: Boolean
  }
}
</script>

<style>
.initializing-dialog {
  background-color: var(--v-grey-darken4);
}
</style>