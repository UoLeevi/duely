<template>
  <router-link :to="`/dashboard?subdomain=${agency.subdomain.name}`" >
    <v-card :color="backgroundColor" dark width="200" class="rounded-corners-tiny pa-1 ma-4 elevation-6">
      <v-img v-if="agency.theme" contain :src="agency.theme.imageLogo.data" height="100px" class="mb-n5" />
      <v-card-text>
        <h3 :style="{ 'color': nameColor }" class="f-3b pb-1">{{ agency.name }}</h3>
        <span :style="{ 'color': subdomainNameColor }" class="f-2b">{{ agency.subdomain.name }}.duely.app</span>
      </v-card-text>
    </v-card>
  </router-link>
</template>

<script>
export default {
  props: {
    agency: Object /*{
      uuid
      name
      subdomain {
        uuid
        name
      }
      theme {
        uuid
        name
        imageLogo {
          uuid
          name
          color
          data
        }
        imageHero {
          uuid
          name
          color
          data
        }
        colorPrimary
        colorSecondary
        colorAccent
        colorBackground
        colorSurface
        colorError
        colorSuccess
      }
    }*/
  },
  computed: {
    backgroundColor() {
      return this.agency.theme 
        ? this.chooseContrastingColor(this.agency.theme.imageLogo.color, this.agency.theme.colorSurface, this.agency.theme.colorPrimary, this.agency.theme.colorSecondary)
        : this.colorHex('primary');
    },
    nameColor() {
      return this.agency.theme 
        ? this.chooseContrastingColor(this.backgroundColor, this.agency.theme.colorPrimary, this.agency.theme.colorSecondary, '#FFFFFF', '#000000')
        : this.chooseContrastingColor(this.backgroundColor, this.colorHex('primary'), this.colorHex('secondary'), '#FFFFFF', '#000000');
    },
    subdomainNameColor() {
      return this.agency.theme 
        ? this.chooseContrastingColor(this.backgroundColor, this.agency.theme.colorSecondary, this.agency.theme.colorAccent, '#FFFFFF', '#000000')
        : this.chooseContrastingColor(this.backgroundColor, this.colorHex('secondary'), this.colorHex('accent'), '#FFFFFF', '#000000');
    }
  }
};
</script>
