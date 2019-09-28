<template>
  <section class="d-flex mx-auto align-center">
    <v-progress-circular v-if="$vgraph.loading" indeterminate />
    <template v-else>
      <div class="text-center">
        <b class="f-8">Hi {{ $vgraph.me.name }}</b>
        <p class="f-3 grey--text">Welcome back to duely, we missed You!</p>
      </div>
    </template>
  </section>
</template>

<script>
export default {};
</script>