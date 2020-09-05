<template>
  <v-container class="narrow-layout d-flex" fluid :style="{'background-color': colorHex(backgroundColor)}">
    <v-row no-gutters class="flex-d align-center fill-height" align="center" justify="center" style="height: 100%;">
      <v-col :cols="1" :xl="4" :lg="3" :md="2" align="left" />
      <v-col>
        <v-fade-transition mode="out-in">
          <slot></slot>
        </v-fade-transition>
      </v-col>
      <v-col :cols="1" :xl="4" :lg="3" :md="2" align="right" />
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  }
};
</script>

<style>
.narrow-layout {
  position: relative;
  min-height: 100vh;
  align-items: center;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.narrow-layout::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}
</style>