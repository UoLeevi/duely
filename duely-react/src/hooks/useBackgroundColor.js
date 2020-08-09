import { useLayoutEffect } from 'react';

function computeLightness(mod, l) {
  mod = /(l\dn?)/.exec(mod)?.[1];
  l = l.trim().replace('calc', '');

  switch (mod) {
    case 'l10': return `100%`;
    case 'l9': return `calc(var(--color-d9) * (100% - (${l})) + (${l}))`;
    case 'l8': return `calc(var(--color-d8) * (100% - (${l})) + (${l}))`;
    case 'l7': return `calc(var(--color-d7) * (100% - (${l})) + (${l}))`;
    case 'l6': return `calc(var(--color-d6) * (100% - (${l})) + (${l}))`;
    case 'l5': return `calc(var(--color-d5) * (100% - (${l})) + (${l}))`;
    case 'l4': return `calc(var(--color-d4) * (100% - (${l})) + (${l}))`;
    case 'l3': return `calc(var(--color-d3) * (100% - (${l})) + (${l}))`;
    case 'l2': return `calc(var(--color-d2) * (100% - (${l})) + (${l}))`;
    case 'l1': return `calc(var(--color-d1) * (100% - (${l})) + (${l}))`;
    case 'l1n': return `calc(var(--color-d9) * (${l}))`;
    case 'l2n': return `calc(var(--color-d8) * (${l}))`;
    case 'l3n': return `calc(var(--color-d7) * (${l}))`;
    case 'l4n': return `calc(var(--color-d6) * (${l}))`;
    case 'l5n': return `calc(var(--color-d5) * (${l}))`;
    case 'l6n': return `calc(var(--color-d4) * (${l}))`;
    case 'l7n': return `calc(var(--color-d3) * (${l}))`;
    case 'l8n': return `calc(var(--color-d2) * (${l}))`;
    case 'l9n': return `calc(var(--color-d1) * (${l}))`;
    case 'l10n': return `0%`;
    default: return l;
  }
}

const backgroundMods = new WeakMap();
const backgroundOwners = new WeakMap();

export default function useBackgroundColor(ref, mod) {
  const mounted = ref?.current;

  useLayoutEffect(() => {
    if (!ref?.current) return;
    if (backgroundMods.has(ref)) return;

    const bg = ref.current.closest('[data-bg-base]') ?? document.documentElement;
    const owner = backgroundOwners.get(bg);

    if (owner?.current && owner !== ref && ref.current.contains(owner.current)) return;

    backgroundOwners.set(bg, ref);
    backgroundMods.set(ref, mod);

    const base = bg.closest('[data-bg-base]') ?? document.documentElement;
    const style = window.getComputedStyle(base);
    // const h = style.getPropertyValue('--background-color-h');
    // const s = style.getPropertyValue('--background-color-s');
    const l = style.getPropertyValue(base === document.documentElement ? '--color-background-l' : '--background-color-l');
    // const a = style.getPropertyValue('--background-color-a');

    bg.style.setProperty('--background-color-l', computeLightness(mod, l));
    bg.style.setProperty('--background-color', 'hsla(var(--background-color-h), var(--background-color-s), var(--background-color-l), var(--background-color-a))');
    bg.style.setProperty('background-color', 'var(--background-color)');

    return () => backgroundMods.delete(ref);
  }, [ref, mounted, mod]);
}
