<template>
  <section :style="{ 'background': `linear-gradient(${backgroundTilt}deg, ${colorHex(backgroundColor)}, ${colorHex(backgroundColorTo || backgroundColor)})`, 'color': colorHex(textColor) }" class="d-flex flex-column justify-center">
    <v-container fluid class="pa-0">
      <v-row no-gutters class="flex-d align-center" align="center" justify="center" style="height: 100%; flex-wrap: nowrap;">
        <v-col :cols="1" md="2" lg="1" xl="2" align="left" />
        <v-col v-if="$vuetify.breakpoint.lgAndUp && !!$slots.left">
          <slot name="left"/>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.lgAndUp && !!$slots.left" :cols="1" align="left" />
        <v-col>
          <slot/>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.lgAndUp && !!$slots.right" :cols="1" align="right" />
        <v-col v-if="$vuetify.breakpoint.lgAndUp && !!$slots.right">
          <slot name="right"/>
        </v-col>
        <v-col :cols="1" md="2" lg="1" xl="2" align="right" />
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  props: {
    sectionName: String,
    backgroundTilt: {
      default: 0,
      type: Number
    },
    backgroundColor: String,
    backgroundColorTo: String,
    textColor: String
  }
};
</script>

<style scoped>
section {
  min-height: 100vh;
  padding-top: 112px;
  padding-bottom: 112px;
}
</style>
