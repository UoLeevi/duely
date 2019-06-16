<template>
  <v-container fluid class="pa-0">
    <HomeSection
      edge-type="1"
      :background-color="$vuetify.theme.parsedTheme.secondary.base"
      background-color-next="#FFFFFF">
      <HomeAppBar/>
      <slot name="hero"></slot>
    </HomeSection>
    <slot></slot>
  </v-container>
</template>

<script>
import HomeSection from "@/components/HomeSection";
import HomeAppBar from "@/components/HomeAppBar";

export default {
  components: {
    HomeSection,
    HomeAppBar
  }
};
</script>
