<template>
  <td :class="{ 'text-left': left, 'text-center': center, 'text-right': right }">
    <div :class="{ 'align-start': left, 'align-center': center, 'align-end': right }" class="d-flex flex-column align-start">
      <slot></slot>
    </div>
  </td>
</template>

<script>
export default {
  props: {
    left: Boolean,
    center: Boolean,
    right: Boolean,
  }
};
</script>
