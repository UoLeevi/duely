<template>
  <th :class="{ 'text-left': left, 'text-center': center, 'text-right': right }" class="text-left text-no-wrap f-2b surface--text text--lighten-2" :style="{ 'height': 'auto', 'background-color': colorHex('background lighten-5') }"><slot></slot></th>
</template>

<script>
export default {
  props: {
    left: Boolean,
    center: Boolean,
    right: Boolean
  }
}
</script>
