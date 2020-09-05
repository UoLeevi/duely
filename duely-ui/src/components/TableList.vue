<template>
  <v-progress-circular v-if="loading" indeterminate />
  <div v-else style="position: relative; width: 100%;">
    <v-simple-table fixed-header class="rounded-corners-small" :style="{ 'background-color': colorHex('background lighten-5') }">
      <template #default>
        <thead>
          <slot name="header" />
        </thead>
        <tbody>
          <slot />
        </tbody>
      </template>
    </v-simple-table>
    <slot name="actions" />
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: [Number, Boolean],
      default: false
    }
  }
}
</script>