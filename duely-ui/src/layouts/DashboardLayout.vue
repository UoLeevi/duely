<template>
  <div>
    <v-navigation-drawer app color="grey lighten-4" floating clipped permanent stateless :mini-variant="!drawer" mini-variant-width="52" class="pa-2">
      <v-layout column align-content-start>
        <v-layout align-content-center class="mb-2">
          <v-btn text icon @click="drawer = !drawer">
            <v-icon>menu</v-icon>
          </v-btn>
        </v-layout>
        <v-layout v-for="item in items" :key="item.title" align-content-center class="mb-2">
          <v-btn text icon @click="drawer = !drawer">
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
          <span class="ml-2 grey--text my-auto body-2 font-weight-bold">{{ item.title }}</span>
        </v-layout>
      </v-layout>
    </v-navigation-drawer>

    <v-app-bar app dark flat dense clipped-left color="secondary">
      <v-layout fill-height align-center justify-center>
        <v-flex xs4 sm3 lg4>
          <v-layout justify-start>
            <v-toolbar-title class="headline my-auto">
              <h3 class="logo-text-spacing">duely</h3>
            </v-toolbar-title>
          </v-layout>
        </v-flex>
        <v-flex v-if="$vuetify.breakpoint.mdAndUp">
          <v-layout justify-center>

          </v-layout>
        </v-flex>
        <v-flex md5>
          <v-layout justify-end>
            <div class="my-auto">
              <v-fade-transition mode="out-in">
                <v-progress-circular v-if="$root.loading" indeterminate />
                 <v-tooltip v-else bottom>
                  <template v-slot:activator="{ on }">
                    <v-avatar  color="primary" size="32">
                      <v-icon dark v-on="on">account_circle</v-icon>
                    </v-avatar>
                  </template>
                  <span class="caption" :style="{ 'white-space': 'nowrap' }">Duely account: {{ $root.graph.me.name }} ({{ $root.graph.me.email }})</span>
                </v-tooltip>
              </v-fade-transition>
            </div>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-app-bar>

    <v-fade-transition mode="out-in">
      <slot></slot>
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      items: [
        { title: 'Dashboard', icon: 'dashboard' },
        { title: 'Account', icon: 'account_box' },
        { title: 'Admin', icon: 'gavel' },
      ],
    }
  }
}
</script>

<style>
#app {
  background-color: var(--v-accent-lighten5);
}

.logo-text-spacing {
  letter-spacing: 0.01em;
}
</style>
