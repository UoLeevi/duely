<template>
  <router-link :to="to" class="text-link d-flex flex-column align-start" :class="{ 'route-matches': $route.path === to, selected, notification }">
    <span :class="small ? 'f-1 pa-1' : 'f-2 pa-2'">{{ text }}</span>
  </router-link>
</template>
<script>
export default {
  props: {
    to: {
      type: String,
      default: '/'
    },
    small: Boolean,
    color: {
      type: String,
      default: 'white'
    },
    iconColor: {
      type: String,
      default: 'white'
    },
    icon: String,
    text: String,
    selected: Boolean,
    notification: Boolean
  }
};
</script>

<style scoped>
.text-link {
  cursor: pointer;
  box-sizing: border-box;
}

.text-link > span {
  color: var(--v-surface-lighten2);
  transition: color 300ms;
}

.text-link.route-matches > span,
.text-link.router-link-exact-active > span,
.text-link.selected > span {
  color: var(--v-surface-lighten4);
}

.text-link:not(.route-matches):not(.selected):not(.router-link-exact-active):hover > span {
  color: var(--v-surface-lighten3);
}
</style>