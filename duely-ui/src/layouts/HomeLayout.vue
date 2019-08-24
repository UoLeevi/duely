<template>
  <v-container fluid class="pa-0" id="home-layout">
    <HomeAppBar :text-color="currentSection ? currentSection.textColor : 'white'" />
    <nav>
      <span v-for="(section, index) in sections" :key="section._uid" :class="{'active': sectionIndex === index }"
       @click="scrollToSection(sectionIndex = index)">
       <span :style="{ 'background-color': currentSection ? colorHex(currentSection.textColor) : 'white' }"></span>
      </span>
    </nav>
    <slot></slot>
  </v-container>
</template>

<script>
import HomeAppBar from '@/components/HomeAppBar';

export default {
  components: {
    HomeAppBar
  },
  computed: {
    currentSection() {
      return this.sections
        ? this.sections[this.sectionIndex]
        : null;
    }
  },
  methods: {
    async scrollToSection(index) {
      this.scrolling.ticking = true;
      this.scrolling.minimumScroll = Math.abs(this.scrolling.change);
      this.scrolling.threshold = Math.abs(this.scrolling.counter) * this.scrolling.thresholdMultiplier;
      window.clearInterval(this.scrolling.thresholdIntervalHandle);
      this.scrolling.counter = 0;
      const sectionEl = this.sections[index].$el;
      this.scrolling.sectionTop = await this.$vuetify.goTo(sectionEl, {
        type: 'element',
        container: '#home-layout',
        duration: this.scrolling.transitionDuration
      });
      window.requestAnimationFrame(() => {
        this.scrolling.ticking = false;
        this.scrolling.thresholdIntervalHandle = window.setTimeout(() => {
          this.scrolling.thresholdIntervalHandle = window.setInterval(() => {
            this.scrolling.minimumScroll *= this.scrolling.thresholdDecay;
            this.scrolling.threshold = this.scrolling.threshold * this.scrolling.thresholdDecay;
            if (this.scrolling.threshold < 1) {
              window.clearInterval(this.scrolling.thresholdIntervalHandle);
              this.scrolling.minimumScroll = 0;
            }
          }, this.scrolling.thresholdBackoffInterval);
        }, this.scrolling.cooldownDuration);
      });
    }
  },
  data() {
    return {
      sections: [],
      sectionIndex: 0,
      scrolling: {
        transitionDuration: 1000,
        timeoutDuration: 500,
        thresholdMultiplier: 1.2,
        thresholdDecay: 0.9,
        thresholdBackoffInterval: 60,
        cooldownDuration: 100,

        minimumScroll: 0,
        threshold: 0,
        thresholdIntervalHandle: null,
        counter: 0,
        sectionTop: 0,
        ticking: false,
        timeoutHandle: null,
        change: 0
      }
    };
  },
  mounted() {
    this.sections = this.$slots.default.map(vNode => vNode.componentInstance);
    this.$watch('this.$slots.default', v => this.sections = v.map(vNode => vNode.componentInstance));
    initializeSteppedScrolling(this);
  }
};

function initializeSteppedScrolling(vm) {
  const controlCurrentSection = function() {
    vm.scrolling.change = vm.$el.scrollTop - vm.scrolling.sectionTop;
    vm.$el.scrollTop = vm.scrolling.sectionTop;

    if (vm.scrolling.ticking || Math.abs(vm.scrolling.change) < vm.scrolling.minimumScroll) return;

    vm.scrolling.ticking = true;
    window.requestAnimationFrame(
      async function() {
        window.clearTimeout(vm.scrolling.timeoutHandle);
        vm.scrolling.timeoutHandle = window.setTimeout(() => (vm.scrolling.counter = 0), vm.scrolling.timeoutDuration);
        vm.scrolling.counter += vm.scrolling.change;

        if (vm.scrolling.counter > vm.scrolling.threshold)
          await vm.scrollToSection(++vm.sectionIndex);
        else if (vm.scrolling.counter < -vm.scrolling.threshold)
          await vm.scrollToSection(--vm.sectionIndex);
        else vm.scrolling.ticking = false;
      }
    );
  }

  vm.$el.addEventListener('scroll', controlCurrentSection);
  //vm.$el.addEventListener('touchmove', controlCurrentSection);
  //window.addEventListener('resize', something);
}
</script>

<style>
html {
  overflow-y: hidden !important;
}

#home-layout {
  height: 100vh;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

#home-layout::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

#home-layout > nav {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  right: 10px;
  top: 50vh;
  transform: translateY(-50%);  
}

#home-layout > nav > span {
  margin: 6px;
  height: 1.5rem;
  width: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

#home-layout > nav > span > span {
  border-radius: 50%;
  height: 0.8rem;
  width: 0.8rem;
  transform: scale(0.5);
  transition: all 400ms ease;
}

#home-layout > nav > span.active > span {
  transform: scale(1);
}

#home-layout > nav > span:not(.active):hover > span {
  transform: scale(0.75);
}

</style>