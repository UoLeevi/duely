import React, { useRef } from 'react';
import './ResponsiveLayout.css';
import useBreakpoints from 'hooks/useBreakpoints';
import useCssRect from 'hooks/useCssRect';

// # layout section modifiers
// ## topbar
// - floating:      makes the topbar stay above content

function layoutModifiersFor(element, section, breakpoints) {
  const modifiers = element?.props?.['data-layout']?.split(' ') ?? [];

  if (section === 'nav') {
    modifiers.push(`orientation:${ breakpoints.md ? 'vertical' : 'horizontal' }`);
  }

  return modifiers;
}

function useLayoutElement(element, section, modifiers) {
  const breakpoints = useBreakpoints();
  const defaultRef = useRef();
  const ref = element?.ref ?? defaultRef;
  const sectionModifiers = layoutModifiersFor(element, section, breakpoints);
  const modifierString = sectionModifiers.length === 0 ? '' : '- ' + sectionModifiers.join(' ');
  modifiers.push(...sectionModifiers.map(m => `${section}-${m}`));
  return element && React.cloneElement(element, { 'data-layout': section + modifierString, ref });
}

const ResponsiveLayout = React.forwardRef(({ topbar, nav, aside, header, main, footer, ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;

  const modifiers = [];
  topbar = useLayoutElement(topbar, 'topbar', modifiers);
  useCssRect(topbar?.ref, ref, 'topbar-');

  nav = useLayoutElement(nav, 'nav', modifiers);
  aside = useLayoutElement(aside, 'aside', modifiers);
  header = useLayoutElement(header, 'header', modifiers);
  main = useLayoutElement(main, 'main', modifiers);
  footer = useLayoutElement(footer, 'footer', modifiers);

  return (
    <div className="responsive-layout" ref={ ref } { ...props } data-view={ modifiers.join(' ') }>
      { topbar }
      { nav }
      { aside }
      <div className="body">
        { header }
        { main }
        { footer }
      </div>
    </div>
  );
});

export default ResponsiveLayout;
