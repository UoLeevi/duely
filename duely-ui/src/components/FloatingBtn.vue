<template>
  <v-btn v-on="$listeners" :to="to" absolute dark large rounded bottom right :color="colorHex(color)">
    <span class="text-none f-2b">{{ text }}</span>
    <v-icon v-if="icon" right>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    to: String,
    icon: String,
    text: String,
    color: {
      type: String,
      default: 'primary'
    }
  }
}
</script>
