<template>
  <nav class="vutil-scroll-nav" v-if="$vutil.scroll.targets.length > 1">
    <span v-for="target in $vutil.scroll.targets" :key="target.el.dataset.uuid" :class="{'active': current && current.el.dataset.uuid === target.el.dataset.uuid }" @click="$vutil.scrollTo(target)">
      <span :style="{ 'background-color': color }"></span>
    </span>
  </nav>
</template>

<script>
export default {
  computed: {
    current() {
      return this.$vutil.scroll.current;
    },
    color() {
      return this.current && this.current.binding.value
        ? this.colorHex(this.current.binding.value.color) 
        : 'white';
    }
  }
}
</script>

<style scoped>
nav {
  z-index: 1;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  right: 0px;
  top: 50vh;
  transform: translateY(-50%);
}

nav > span {
  background-color: transparent;
  margin: 5px 0;
  height: 1.7rem;
  width: 1.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

nav > span > span {
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
  transform: scale(0.4);
  transition: all 400ms ease;
}

nav > span.active > span {
  transform: scale(0.6);
}

nav > span:not(.active):hover > span {
  transform: scale(0.5);
}
</style>