<template>
  <DashboardLayout>
    <v-container fluid>
      <v-layout justify-center>
        <v-flex xs12 sm11>
          <v-layout column>
            <v-flex class="pt-2 pb-4">
              <h2 class="headline mb-4">Your agencies</h2>
              <v-card max-width="300">
                <v-img src="https://picsum.photos/300" height="230px" ></v-img>

                <v-card-title>
                  <div>Leanne Wong &amp; Co</div>
                  <span class="grey--text subtitle-1">The SEO agency</span>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex class="pt-4 pb-2">
              <h2 class="headline mb-4">Agencies you do business with</h2>
              <v-card max-width="300">
                <v-img src="https://picsum.photos/300?random" height="230px" ></v-img>

                <v-card-title>
                  <div>Web Native Media</div>
                  <span class="grey--text subtitle-1">Next level marketing</span>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </DashboardLayout>
</template>

<script>
export default {

}
</script>

