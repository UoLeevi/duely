<template>
  <tr style="height: 30px;"><slot></slot></tr>
</template>

<script>
export default {

}
</script>

<style scoped>
tr:last-child td:first-child {
  border-top-left-radius: 0.8rem;
}
tr:last-child td:last-child {
  border-top-right-radius: 0.8rem;
}
</style>
