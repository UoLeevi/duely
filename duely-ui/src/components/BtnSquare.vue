<template>
  <router-link :to="to" class="btn-square d-flex flex-column align-center my-4" :class="{ 'route-matches': $route.path === to, selected, notification, minimized }" :style="{ 'width': `${adjustSize(small ? 64 : 128, small ? 0.2 : 0.5)}px` }">
    <v-avatar class="rounded-corners-small" :color="color" :style="{ 'color': colorHex(color) }" :size="adjustSize(small ? 48 : 64, small ? 0.5 : 0.7)">
      <v-icon v-if="icon" :color="iconColor">{{ icon }}</v-icon>
      <span v-else class="surface--text text--lighten-5 f-5">{{ text[0] }}</span>
    </v-avatar>
    <v-scale-transition leave-absolute mode="out-in">
      <span v-if="!minimized" :class="small ? 'f-1 pt-3' : 'f-2 pt-4'">{{ text }}</span>
    </v-scale-transition>
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
      default: 'surface lighten-5'
    },
    iconColor: {
      type: String,
      default: 'surface lighten-5'
    },
    icon: String,
    text: String,
    selected: Boolean,
    minimized: Boolean,
    notification: Boolean
  }
};
</script>

<style scoped>
.btn-square {
  text-align: center;
  cursor: pointer;
}

.btn-square > span {
  color: var(--v-surface-lighten1);
  transition: color 300ms;
}

.btn-square.route-matches > span,
.btn-square.router-link-exact-active > span,
.btn-square.selected > span {
  color: var(--v-surface-lighten5);
}

.btn-square:not(.route-matches):not(.selected):not(.router-link-exact-active):hover > span {
  color: var(--v-surface-lighten4);
}

.v-avatar {
  transition: box-shadow 300ms;
}

.btn-square.notification .v-avatar::before {
  position: absolute;
  top: -0.3rem;
  right: -0.3rem;
  content: ' ';
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: var(--v-surface-lighten5);
  box-shadow: 0px 0px 0px 0.2rem var(--v-surface-darken2);
}

.btn-square.route-matches > .v-avatar,
.btn-square.router-link-exact-active .v-avatar,
.btn-square.selected .v-avatar {
  box-shadow: 0px 0px 0px 0.3rem var(--v-surface-darken2), 0px 0px 0px 0.45rem,
    0px 0px 1rem 0.45rem rgba(0, 0, 0, 0.5), 0px 0px 1rem 0.45rem;
}

.btn-square:not(.route-matches):not(.selected):not(.router-link-exact-active):hover .v-avatar {
  box-shadow: 0px 0px 0px 0.2rem,
    0px 0px 1rem 0.2rem rgba(0, 0, 0, 0.5), 0px 0px 1rem 0.2rem;
}
</style>