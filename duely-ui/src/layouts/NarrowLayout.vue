<template>
  <v-content>
    <v-container fluid>
      <v-layout justify-center>
        <v-flex xs12 sm11 md8 lg7 xl6>
          <v-fade-transition mode="out-in">
            <slot></slot>
          </v-fade-transition>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
export default {

}
</script>

