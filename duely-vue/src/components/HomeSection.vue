<template>
  <section :style="{
    'background-position': `bottom ${offsetY} left ${offsetX}`,
    'background-color': backgroundColor
    }">
    <slot>

    </slot>
    <div :style="{'height': padBottom}"></div>
  </section>
</template>

<script>

export default {
  props: {
    'edge-type': [Number, String],
    'background-color': {
      type: String,
      default: '#FFFFFF'
    },
    'background-color-next': {
      type: String,
      default: '#FFFFFF'
    }
  },
  computed: {
    offsetX() {
      switch (+this.edgeType) {
        case 1: return '-600px';
        case 2: return '-900px';
        case 3: return '-1200px';
        case 4: return '-1500px';
        case 5: return '-1800px';
        default: return '0px';
      }
    },
    offsetY() {
      switch (+this.edgeType) {
        case 1: return '-80px';
        case 2: return '-120px';
        case 3: return '-160px';
        case 4: return '-110px';
        case 5: return '-80px';
        default: return '0px';
      }
    },
    padBottom() {
      switch (+this.edgeType) {
        case 4: return '250px';
        case 5: return '200px';
        default: return '150px';
      }
    },
    svg() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 190" preserveAspectRatio="xMinYMid slice">
          <path fill="${this.backgroundColorNext}" d="M 0 0 v 190 h 3000 v -190 z" />
          <path fill="${this.backgroundColor}" opacity="0.30" d="M 0 0 v 185 q 170 -15 300 -40 t 300 -40 t 400 -60 t 400 -5 t 300 10 t 300 30 t 300 40 t 400 25 t 300 40 v -185 z" />
          <path fill="${this.backgroundColor}" opacity="0.60" d="M 0 0 v 175 q 160 -5 300 -40 t 300 -40 t 400 -60 t 400 -5 t 300 10 t 300 30 t 300 45 t 400 18 t 300 42 v -175 z" />
          <path fill="${this.backgroundColor}" opacity="1.00" d="M 0 0 v 170 q 150 -15 300 -40 t 300 -40 t 400 -60 t 400 -5 t 300 10 t 300 30 t 300 40 t 400 25 t 300 40 v -170 z" />
        </svg>`;
    }
  },
  watch: {
    backgroundColor() {
      this.$el.style.backgroundImage = `url(data:image/svg+xml;base64,${window.btoa(this.svg)})`;
    },
    backgroundColorNext() {
      this.$el.style.backgroundImage = `url(data:image/svg+xml;base64,${window.btoa(this.svg)})`;
    }
  },
  mounted() {
    this.$el.style.backgroundImage = `url(data:image/svg+xml;base64,${window.btoa(this.svg)})`;
  }
};
</script>

<style scoped>
section {
  min-height: 300px;
  background-size: auto 300px;
  background-repeat: repeat-x;
}
</style>
