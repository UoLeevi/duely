
const Vutil = function (){};
Vutil.install = function(Vue) {
  const scroll = {
    timeoutDuration: 500,
    thresholdMultiplier: 1.2,
    thresholdDecay: 0.9,
    thresholdBackoffInterval: 60,
    cooldownDuration: 100,

    minimumScroll: 0,
    threshold: 0,
    thresholdIntervalHandle: null,
    counter: 0,
    ticking: false,
    timeoutHandle: null,
    change: 0,
    touchstart: 0,

    rule: null
  };

  const stylesheet = (function () {
    const el = document.createElement('style');
    document.head.appendChild(el);
    return el.sheet;
  })();

  scroll.rule = stylesheet.cssRules[stylesheet.insertRule(`
    html.custom-scroll {
      top: 0px;
      transition: top 1000ms cubic-bezier(0.455, 0.030, 0.515, 0.955); /* easeInOutQuad */
      position: fixed;
      overflow: hidden !important;
    }
  `)];

  const vutil = Vue.observable({
    scroll: {
      targets: [],
      current: null,
    },
    scrollTo
  })

  Vue.prototype.$vutil = vutil;

  document.addEventListener('wheel', customScrollHandler);
  document.addEventListener('touchstart', customScrollHandler);
  document.addEventListener('touchmove', customScrollHandler, { passive: false });
  document.documentElement.addEventListener('transitionend', customScrollFinishHandler);

  Vue.directive('scroll-target', {
    bind(el) {
      el.dataset.uuid = el.dataset.uuid || uuidv4();
    },
    unbind(el) {
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

  function scrollTo(el) {
    const top = `${-getTotalOffsetTop(el)}px`;

    if (scroll.rule.style.top === top)
      return;

    scroll.ticking = true;

    scroll.rule.style.top = top;
    vutil.scroll.current = vutil.scroll.targets.find(target => target.el.dataset.uuid === el.dataset.uuid) || null;

    // TODO: move these elsewhere
    scroll.minimumScroll = Math.abs(scroll.change);
    scroll.threshold = Math.abs(scroll.counter) * scroll.thresholdMultiplier;
    window.clearInterval(scroll.thresholdIntervalHandle);
    scroll.counter = 0;
  }

  function customScrollHandler(e) {
    if (vutil.scroll.targets.length === 0 || scroll.ticking || scroll.busy)
      return;

    switch (e.type) {
      case 'wheel':
        scroll.change = e.deltaY;
        break;
      case 'touchstart':
        scroll.touchstart = e.touches[0].clientY;
        return;
      case 'touchmove':
        e.preventDefault();
        var y = e.changedTouches[0].clientY;
        scroll.change = scroll.touchstart - y;
        scroll.touchstart = y;
        break;
    }

    if (Math.abs(scroll.change) < scroll.minimumScroll)
      return;

    scroll.ticking = true;
    window.requestAnimationFrame(function () {
      window.clearTimeout(scroll.timeoutHandle);
      scroll.timeoutHandle = window.setTimeout(() => (scroll.counter = 0), scroll.timeoutDuration);
      scroll.counter += scroll.change;

      const index = vutil.scroll.targets
          .map(target => target.el.dataset.uuid)
          .indexOf(vutil.scroll.current && vutil.scroll.current.el.dataset.uuid);

      if (index === -1)
        scrollTo(vutil.scroll.targets[0].el);
      else if (scroll.counter > scroll.threshold && index + 1 < vutil.scroll.targets.length)
        scrollTo(vutil.scroll.targets[index + 1].el);
      else if (scroll.counter < -scroll.threshold && index > 0)
        scrollTo(vutil.scroll.targets[index - 1].el);
      else
        scroll.ticking = false;
    });
  }

  function customScrollFinishHandler(e) {
    if (!vutil.scroll.targets || e.type !== 'transitionend' || e.propertyName !== 'top' || e.target.localName !== 'html')
      return;

    window.requestAnimationFrame(() => {
      scroll.ticking = false;
      scroll.thresholdIntervalHandle = window.setTimeout(() => {
        scroll.thresholdIntervalHandle = window.setInterval(() => {
          scroll.minimumScroll *= scroll.thresholdDecay;
          scroll.threshold =
            scroll.threshold * scroll.thresholdDecay;
          if (scroll.threshold < 1) {
            window.clearInterval(scroll.thresholdIntervalHandle);
            scroll.minimumScroll = 0;
          }
        }, scroll.thresholdBackoffInterval);
      }, scroll.cooldownDuration);
    });
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