<template>
  <section class="d-flex mx-auto align-center">
    <v-progress-circular v-if="$apollo.queries.me.loading" indeterminate />
    <template v-else>
      <div class="text-center">
        <b class="f-8">Hi, {{ me.name }}</b>
        <p class="f-3 surface--text">Welcome back to duely, we missed you!</p>
      </div>
    </template>
  </section>
</template>

<script>
import { gql } from '@/apollo';

export default {
  apollo : {
    me: gql`query {
      me {
        uuid
        name
      }
    }`
  }
};
</script>
