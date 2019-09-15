<template>
  <router-link :to="to" class="btn-square d-flex flex-column align-center my-4" :class="{ selected, notification }" :style="{ 'width': `${adjustSize(128, 0.5)}px` }">
    <v-avatar class="rounded-corners-small" :color="color" :style="{ 'color': colorHex(color) }" :size="adjustSize(64, 0.7)">
      <v-icon v-if="icon" color="white">{{ icon }}</v-icon>
      <span v-else class="white--text headline">{{ text[0] }}</span>
    </v-avatar>
    <span class="f-2 pt-4">{{ text }}</span>
  </router-link>
</template>
<script>
export default {
  props: {
    to: {
      type: String,
      default: '/'
    },
    color: String,
    icon: String,
    text: String,
    selected: Boolean,
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
  color: var(--v-grey-base);
  transition: color 300ms;
}

.btn-square.router-link-exact-active > span,
.btn-square.selected > span {
  color: var(--v-grey-lighten3);
}

.btn-square:not(.selected):not(.router-link-exact-active):hover > span {
  color: var(--v-grey-lighten2);
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
  background-color: white;
  box-shadow: 0px 0px 0px 0.2rem var(--v-grey-darken4);
}

.btn-square.router-link-exact-active .v-avatar,
.btn-square.selected .v-avatar {
  box-shadow: 0px 0px 0px 0.3rem var(--v-grey-darken4), 0px 0px 0px 0.45rem,
    0px 0px 1rem 0.45rem rgba(0, 0, 0, 0.7), 0px 0px 1rem 0.45rem;
}

.btn-square:not(.selected):not(.router-link-exact-active):hover .v-avatar {
  box-shadow: 0px 0px 0px 0.2rem,
    0px 0px 1rem 0.2rem rgba(0, 0, 0, 0.7), 0px 0px 1rem 0.2rem;
}
</style>