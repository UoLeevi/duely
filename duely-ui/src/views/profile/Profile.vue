<template>
  <ProfileLayout>
    <template #menu>
      <BtnSquare v-for="item in items" :key="item.to" v-bind="item" :small="$vuetify.breakpoint.xs" :class="{ 'py-2': !$vuetify.breakpoint.xs }" />
    </template>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
  </ProfileLayout>
</template>

<script>
import BtnSquare from '@/components/BtnSquare';

export default {
  components: {
    BtnSquare
  },
  data() {
    return {
      items: [
        {
          to: '/profile/agencies',
          color: 'blue',
          text: 'Agencies',
          icon: 'home'
        },
        {
          to: '/profile/create-agency',
          color: 'green',
          text: 'Create agency',
          icon: 'add'
        },
        {
          to: '/profile/settings',
          color: 'surface',
          text: 'Settings',
          icon: 'settings'
        }
      ]
    };
  }
};
</script>

