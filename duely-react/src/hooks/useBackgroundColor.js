import { useLayoutEffect } from 'react';

function computeLightness(mod, l) {
  mod = /(l\dn?)/.exec(mod)?.[1];
  l = l.trim().replace('calc', '');

  switch (mod) {
    case 'l9': return `calc(.96 * (100% - (${l})) + (${l}))`;
    case 'l8': return `calc(.90 * (100% - (${l})) + (${l}))`;
    case 'l7': return `calc(.80 * (100% - (${l})) + (${l}))`;
    case 'l6': return `calc(.70 * (100% - (${l})) + (${l}))`;
    case 'l5': return `calc(.60 * (100% - (${l})) + (${l}))`;
    case 'l4': return `calc(.50 * (100% - (${l})) + (${l}))`;
    case 'l3': return `calc(.40 * (100% - (${l})) + (${l}))`;
    case 'l2': return `calc(.30 * (100% - (${l})) + (${l}))`;
    case 'l1': return `calc(.15 * (100% - (${l})) + (${l}))`;
    case 'l1n': return `calc(.85 * (${l}))`;
    case 'l2n': return `calc(.70 * (${l}))`;
    case 'l3n': return `calc(.55 * (${l}))`;
    case 'l4n': return `calc(.40 * (${l}))`;
    case 'l5n': return `calc(.30 * (${l}))`;
    case 'l6n': return `calc(.20 * (${l}))`;
    case 'l7n': return `calc(.15 * (${l}))`;
    case 'l8n': return `calc(.10 * (${l}))`;
    case 'l9n': return `calc(.05 * (${l}))`;
    default: return l;
  }
}

export default function useBackgroundColor(ref, mod) {
  const mounted = ref?.current;
  useLayoutEffect(() => {
    if (!ref?.current) return;

    const root = document.getElementById('root');
    const bg = ref.current.closest('[data-bg-base]') ?? root;
    const base = bg === root ? document.documentElement : (bg.closest('[data-bg-base]') ?? root);
    const style = window.getComputedStyle(base);
    // const h = style.getPropertyValue('--background-color-h');
    // const s = style.getPropertyValue('--background-color-s');
    const l = style.getPropertyValue('--background-color-l');
    // const a = style.getPropertyValue('--background-color-a');

    bg.style.setProperty('--background-color-l', computeLightness(mod, l));
    bg.style.setProperty('--background-color', 'hsla(var(--background-color-h), var(--background-color-s), var(--background-color-l), var(--background-color-a))');
    bg.style.setProperty('background-color', 'var(--background-color)');
  }, [ref, mounted, mod]);
}
