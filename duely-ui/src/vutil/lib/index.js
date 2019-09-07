
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
  })

  Vue.prototype.$vutil = vutil;

  Vue.directive('scroll-target', {
    bind(el) {
      el.dataset.uuid = el.dataset.uuid || uuidv4();
      el.classList.add('scroll-target');
    },
    unbind(el) {
      el.classList.remove('scroll-target');
      vutil.scroll.targets = vutil.scroll.targets.filter(target => target.el.dataset.uuid !== el.dataset.uuid);

      if (vutil.scroll.targets.length === 0)
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

      if (vutil.scroll.targets.length === 1)
        document.documentElement.classList.add('custom-scroll');
    }
  })

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