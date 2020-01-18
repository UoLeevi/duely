
const Vutil = function (){};
Vutil.install = function(Vue) {
  const stylesheet = (function () {
    const el = document.createElement('style');
    document.head.appendChild(el);
    return el.sheet;
  })();

  stylesheet.insertRule(`
    html.custom-scroll {
      scroll-behavior: smooth;
      scroll-snap-type: y proximity;
      overflow-y: scroll;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none;  /* IE 10+ */
    }
  `);

  stylesheet.insertRule(`
    html.custom-scroll::-webkit-scrollbar { /* WebKit */
      display: none;
    }
  `);

  stylesheet.insertRule(`
    html.custom-scroll .scroll-target {
      scroll-snap-align: start;
    }
  `);

  const vutil = Vue.observable({
    scroll: {
      targets: [],
      current: null,
    },
    scrollTo
  });

  let customScrollCounter = 0;

  Vue.prototype.$vutil = vutil;

  Vue.mixin({
    methods: {
      colorHex(color) {
        if (typeof color !== 'string')
          return color;
  
        if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color))
          return color;
  
        const [name, variant] = color.split(' ');
        const themeItem = this.$vuetify.theme.currentTheme[name];
        return themeItem ? themeItem[variant ? variant.replace('-', '') : 'base'] : color;
      },
      adjustSize(xl, factor = 1.0) {
        if (this.$vuetify.breakpoint.name === 'xl')
          return xl;

        if (this.$vuetify.breakpoint.name === 'lg')
          return (xl + xl * (1 - ((1 - this.$vuetify.breakpoint.thresholds.md / this.$vuetify.breakpoint.thresholds.lg) * factor))) / 2;

        return xl * (1 - ((1 - this.$vuetify.breakpoint.thresholds[this.$vuetify.breakpoint.name] / this.$vuetify.breakpoint.thresholds.lg) * factor));
      },
      removeQueryParameters(...keys) {
        if (Object.keys(this.$route.query).length === 0)
          return;

        const query = Object.assign({}, this.$route.query);

        for (const key of keys)
          delete query[key];

        if (Object.keys(query).length !== Object.keys(this.$route.query).length)
          this.$router.replace({ query });
      }
    }
  });

  Vue.directive('custom-scroll', {
    bind() {
      if (!customScrollCounter++)
        document.documentElement.classList.add('custom-scroll');
    },
    unbind() {
      if (!--customScrollCounter)
        document.documentElement.classList.remove('custom-scroll');
    }
  });

  Vue.directive('scroll-target', {
    bind(el) {
      el.dataset.uuid = el.dataset.uuid || uuidv4();
      el.classList.add('scroll-target');

      if (!customScrollCounter++)
        document.documentElement.classList.add('custom-scroll');
    },
    unbind(el) {
      el.classList.remove('scroll-target');
      vutil.scroll.targets = vutil.scroll.targets.filter(target => target.el.dataset.uuid !== el.dataset.uuid);

      if (!--customScrollCounter)
        document.documentElement.classList.remove('custom-scroll');

      if (vutil.scroll.current && vutil.scroll.current.el.dataset.uuid === el.dataset.uuid)
        vutil.scroll.current = null;
    },
    inserted(el, binding, vnode) {
      const target = { el, binding, vnode };
      vutil.scroll.targets = vutil.scroll.targets
        .concat([target])
        .sort((a, b) => a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1);

      if (!vutil.scroll.current)
        vutil.scroll.current = target;
    }
  });

  let backgroundColorDefault;
  const backgroundColorStack = []

  Vue.directive('background-color', {
    bind(el, binding, vnode) {
      while (!vnode.componentInstance)
        vnode = vnode.parent;

      const theme = vnode.componentInstance.$vuetify.theme.currentTheme;

      if (!backgroundColorStack.length) {
        backgroundColorDefault = JSON.parse(JSON.stringify(theme.background.base));
        backgroundColorStack.push(backgroundColorDefault);
      }

      let color = binding.value || backgroundColorDefault;

      if (typeof color === 'string' && !/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)) {
        const [name, variant] = color.split(' ');
        const themeItem = theme[name];
        color = themeItem ? themeItem[variant ? variant.replace('-', '') : 'base'] : color;
      }

      backgroundColorStack.push(color);
      theme.background.base = backgroundColorStack[backgroundColorStack.length - 1];
    },
    unbind(el, binding, vnode) {
      while (!vnode.componentInstance)
        vnode = vnode.parent;

      --backgroundColorStack.length;
      vnode.componentInstance.$vuetify.theme.currentTheme.background.base = backgroundColorStack[backgroundColorStack.length - 1];
    }
  });

  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking && vutil.scroll.targets) {
      ticking = true;
      window.requestAnimationFrame(function() {
        const closest = {
          target: null,
          distance: Infinity
        };

        for (const target of vutil.scroll.targets) {
          const distance = Math.abs(target.el.getBoundingClientRect().top);

          if (distance > closest.distance)
            break;

          closest.distance = distance;
          closest.target = target;
        }

        vutil.scroll.current = closest.target;

        ticking = false;
      });
    }
  });

  function scrollTo(target) {
    window.scrollTo(0, getTotalOffsetTop(target.el));
  }

  function getTotalOffsetTop(el) {
    let offsetTop = 0;
    while (el) {
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }
    return offsetTop;
  }

  // https://stackoverflow.com/a/2117523
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export default Vutil;