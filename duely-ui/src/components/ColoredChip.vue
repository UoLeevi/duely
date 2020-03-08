<template>
  <span class="f-1b rounded-corners-tiny d-inline-block" :style="{ 'line-height': '2rem', 'min-width': '100px', 'background-color': backgroundColor, 'color': textColor }"><slot></slot></span>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'surface'
    }
  },
  computed: {
    textColor() {
      return this.colorHex(this.color);
    },
    backgroundColor() {
      return this.changeBrightness(this.textColor, 0.88);
    }
  }
}
</script>
