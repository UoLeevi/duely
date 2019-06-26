<template>
  <HomeLayout>
    <template #hero>
        <v-layout>
          <v-spacer/>
          <HomeHeroOptIn dark/>
          <v-spacer/>
          <v-spacer/>
        </v-layout>
    </template>
    <HomeSection 
      edge-type="4"
      background-color="#FFFFFF" 
      background-color-next="#F2F2F2">
      <v-layout>
        <v-spacer/>
        <v-spacer/>
        <v-card class="pa-4" flat color="transparent" max-width="680px">
          <v-card-title>
            <h3 class="display-1 primary--text">Effortless set up</h3>
            <p
              class="headline my-2"
            >With just a few clicks, you’ll get a fully functioning services platform with client management system, payment gateways, invoicing and marketing tools.</p>
          </v-card-title>
          <v-card-title>
            <h3 class="display-1 primary--text">Intuitive service request system</h3>
            <p
              class="headline my-2"
            >Easily accept and manage client requests with our services platform. No email threads, no contracts, no drama.</p>
          </v-card-title>
          <v-card-title>
            <h3 class="display-1 primary--text">Personalized solutions</h3>
            <p
              class="headline my-2"
            >Get a professional services website in just a few clicks. Personalize it according to your brand and business.</p>
          </v-card-title>
        </v-card>
        <v-spacer/>
      </v-layout>
    </HomeSection>
    <HomeSection 
      edge-type="2"
      background-color="#F2F2F2">
      <v-layout>
      </v-layout>
    </HomeSection>
  </HomeLayout>
</template>

<script>
import HomeSection from "@/components/HomeSection";
import HomeHeroOptIn from "@/components/HomeHeroOptIn";

export default {
  components: {
    HomeSection,
    HomeHeroOptIn
  }
};
</script>
