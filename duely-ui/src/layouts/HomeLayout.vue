<template>
  <v-container fluid class="pa-0" id="home-layout">
    <HomeAppBar :text-color="currentSection ? currentSection.textColor : 'white'" />
    <nav>
      <span v-for="(section, index) in sections" :key="section._uid" :class="{'active': sectionIndex === index }" @click="scrollToSection(index)">
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
      return this.sections ? this.sections[this.sectionIndex] : null;
    }
  },
  methods: {
    async scrollToSection(index) {
      if (this.scrolling.busy) return;

      this.scrolling.busy = true;

      this.sectionIndex = index;
      this.scrolling.ticking = true;
      this.scrolling.minimumScroll = Math.abs(this.scrolling.change);
      this.scrolling.threshold =
        Math.abs(this.scrolling.counter) * this.scrolling.thresholdMultiplier;
      window.clearInterval(this.scrolling.thresholdIntervalHandle);
      this.scrolling.counter = 0;
      const sectionEl = this.sections[index].$el;
      document.documentElement.style.top = '';
      this.$el.classList.add('scrolling');
      this.scrolling.sectionTop = await this.$vuetify.goTo(sectionEl, {
        type: 'element',
        container: '#home-layout',
        duration: this.scrolling.transitionDuration
      });
      document.documentElement.style.top = -this.scrolling.sectionTop + 'px';
      this.$el.classList.remove('scrolling');
      window.requestAnimationFrame(() => {
        this.scrolling.ticking = false;
        this.scrolling.thresholdIntervalHandle = window.setTimeout(() => {
          this.scrolling.thresholdIntervalHandle = window.setInterval(() => {
            this.scrolling.minimumScroll *= this.scrolling.thresholdDecay;
            this.scrolling.threshold =
              this.scrolling.threshold * this.scrolling.thresholdDecay;
            if (this.scrolling.threshold < 1) {
              window.clearInterval(this.scrolling.thresholdIntervalHandle);
              this.scrolling.minimumScroll = 0;
            }
          }, this.scrolling.thresholdBackoffInterval);
        }, this.scrolling.cooldownDuration);
        this.scrolling.busy = false;
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
        change: 0,
        touchstart: null,
        busy: false
      }
    };
  },
  mounted() {
    document.documentElement.classList.add('no-scroll');
    this.sections = this.$slots.default.map(vNode => vNode.componentInstance);
    initializeSteppedScrolling(this);
  },
  destroyed() {
    document.documentElement.classList.remove('no-scroll');
    document.documentElement.style.top = '';
  }
};

function initializeSteppedScrolling(vm) {
  const controlCurrentSection = function(e) {
    switch (e.type) {
      case 'wheel':
        vm.scrolling.change = e.deltaY;
        break;
      case 'touchstart':
        vm.scrolling.touchstart = e.touches[0].clientY;
        return;
      case 'touchmove':
        e.preventDefault();
      // fall through
      case 'touchend':
        var y = e.changedTouches[0].clientY;
        vm.scrolling.change = vm.scrolling.touchstart - y;
        vm.scrolling.touchstart = y;
        break;
    }

    if (
      vm.scrolling.ticking ||
      Math.abs(vm.scrolling.change) < vm.scrolling.minimumScroll
    )
      return;

    vm.scrolling.ticking = true;
    window.requestAnimationFrame(async function() {
      window.clearTimeout(vm.scrolling.timeoutHandle);
      vm.scrolling.timeoutHandle = window.setTimeout(
        () => (vm.scrolling.counter = 0),
        vm.scrolling.timeoutDuration
      );
      vm.scrolling.counter += vm.scrolling.change;

      if (
        vm.scrolling.counter > vm.scrolling.threshold &&
        vm.sectionIndex + 1 < vm.sections.length
      )
        await vm.scrollToSection(vm.sectionIndex + 1);
      else if (
        vm.scrolling.counter < -vm.scrolling.threshold &&
        vm.sectionIndex > 0
      )
        await vm.scrollToSection(vm.sectionIndex - 1);
      else vm.scrolling.ticking = false;
    });
  };

  vm.$el.addEventListener('wheel', controlCurrentSection);
  vm.$el.addEventListener('touchstart', controlCurrentSection);
  vm.$el.addEventListener('touchmove', controlCurrentSection, {
    passive: false
  });
  vm.$el.addEventListener('touchend', controlCurrentSection);
}
</script>

<style>
html.no-scroll {
  position: fixed;
  overflow: hidden !important;
}

#home-layout.scrolling {
  overflow-y: scroll;
}

#home-layout {
  height: 100vh;
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
  right: 0px;
  top: 50vh;
  transform: translateY(-50%);
}

#home-layout > nav > span {
  background-color: transparent;
  margin: 5px 0;
  height: 1.7rem;
  width: 1.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

#home-layout > nav > span > span {
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
  transform: scale(0.4);
  transition: all 400ms ease;
}

#home-layout > nav > span.active > span {
  transform: scale(0.6);
}

#home-layout > nav > span:not(.active):hover > span {
  transform: scale(0.5);
}
</style>