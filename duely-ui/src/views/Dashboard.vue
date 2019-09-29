<template>
  <DashboardLayout>
    <template #menu>
      <v-row class="flex-column justify-center align-self-center">
        <BtnSquare v-for="item in items" :key="item.to" v-bind="item" small />
      </v-row>
    </template>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
  </DashboardLayout>
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
          to: '/dashboard',
          color: 'blue',
          text: 'Dashboard',
          icon: 'home'
        },
        {
          to: '/dashboard/users',
          color: 'green',
          text: 'Users',
          icon: 'group'
        },
        {
          to: '/profile',
          color: 'lily-blue',
          text: 'Profile',
          icon: 'person'
        }
      ]
    };
  }
};
</script>

<style>
</style>
