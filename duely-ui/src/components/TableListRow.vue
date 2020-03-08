<template>
  <tr style="height: 54px;"><slot></slot></tr>
</template>

<script>
export default {

}
</script>

<style scoped>
tr:hover {
  background-color: var(--v-surface-lighten5) !important;
}

tr:last-child td:first-child {
  border-bottom-left-radius: 0.8rem;
}
tr:last-child td:last-child {
  border-bottom-right-radius: 0.8rem;
}
</style>
