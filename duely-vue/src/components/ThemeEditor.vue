<template>
  <v-bottom-sheet v-model="sheet" hide-overlay>
    <template #activator="{ on }">
      <v-btn color="secondary" dark text v-on="on">
        Open theme editor
      </v-btn>
    </template>
    <v-card flat>
      <v-card-title>
        <h5 class="title">Theme editor</h5>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex shrink class="ma-1">
            <v-text-field color="primary" label="Primary" v-model="$vuetify.theme.currentTheme.primary" hide-details spellcheck="false" :rules="[rules.hexColor]" />
          </v-flex>
          <v-flex shrink class="ma-1">
            <v-text-field color="secondary" label="Secondary" v-model="$vuetify.theme.currentTheme.secondary" hide-details spellcheck="false" :rules="[rules.hexColor]" />
          </v-flex>
          <v-flex shrink class="ma-1">
            <v-text-field color="accent" label="Accent" v-model="$vuetify.theme.currentTheme.accent" hide-details spellcheck="false" :rules="[rules.hexColor]" />
          </v-flex>
          <v-flex shrink class="ma-1">
            <v-text-field color="error" label="Error" v-model="$vuetify.theme.currentTheme.error" hide-details spellcheck="false" :rules="[rules.hexColor]" />
          </v-flex>
          <v-flex shrink class="ma-1">
            <v-text-field color="info" label="Info" v-model="$vuetify.theme.currentTheme.info" hide-details spellcheck="false" :rules="[rules.hexColor]" />
          </v-flex>
          <v-flex shrink class="ma-1">
            <v-text-field color="success" label="Success" v-model="$vuetify.theme.currentTheme.success" hide-details spellcheck="false" :rules="[rules.hexColor]" />
          </v-flex>
          <v-flex shrink class="ma-1">
            <v-text-field color="warning" label="Warning" v-model="$vuetify.theme.currentTheme.warning" hide-details spellcheck="false" :rules="[rules.hexColor]" />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
export default {
  data() {
    return {
      sheet: false,
      rules: {
        hexColor: v => /^#[0-9A-F]{6}$/.test(v) || 'Enter a HEX color code (e.g. #000000)'
      }
    };
  }
}
</script>
