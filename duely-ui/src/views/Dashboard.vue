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
    <v-navigation-drawer :value="true" app floating stateless right :width="adjustSize(600, 0.3)" class="justify-center d-flex flex-column pa-5" color="grey lighten-5">
      <v-fade-transition mode="out-in">
      <router-view name="panel" />
    </v-fade-transition>
    </v-navigation-drawer>
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
          color: 'grey darken-3',
          text: 'Dashboard',
          icon: 'home'
        },
        {
          to: '/dashboard/services',
          color: 'grey darken-3',
          text: 'Services',
          icon: 'business_center'
        },
        {
          to: '/dashboard/payments',
          color: 'grey darken-3',
          text: 'Payments',
          icon: 'attach_money'
        },
        {
          to: '/dashboard/company',
          color: 'grey darken-3',
          text: 'Company',
          icon: 'group'
        },
        {
          to: '/profile',
          color: 'grey darken-3',
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
