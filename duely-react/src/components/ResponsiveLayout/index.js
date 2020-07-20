import React from 'react';
import './ResponsiveLayout.css';
import useBreakpoints from 'hooks/useBreakpoints';

// # layout section modifiers
// ## topbar
// - floating:      makes the topbar stay above content

function layoutModifiersFor(element, section, breakpoints) {
  const modifiers = element?.props?.['data-layout']?.split(' ') ?? [];

  if (section === 'nav') {
    modifiers.push(`orientation:${ breakpoints.md ? 'vertical' : 'horizontal' }`);
  }

  return modifiers.length === 0 ? '' : '- ' + modifiers.join(' ');
}

function createLayoutElement(element, section, breakpoints) {
  return element && React.cloneElement(element, { 'data-layout': section + layoutModifiersFor(element, section, breakpoints) });
}

const ResponsiveLayout = React.forwardRef(({ topbar, nav, aside, header, main, footer, ...props }, ref) => {
  const breakpoints = useBreakpoints();

  return (
    <div className="responsive-layout" ref={ ref } { ...props }>
      { createLayoutElement(topbar, 'topbar', breakpoints) }
      { createLayoutElement(nav, 'nav', breakpoints) }
      { createLayoutElement(aside, 'aside', breakpoints) }
      <div className="body">
        { createLayoutElement(header, 'header', breakpoints) }
        { createLayoutElement(main, 'main', breakpoints) }
        { createLayoutElement(footer, 'footer', breakpoints) }
      </div>
    </div>
  );
});

export default ResponsiveLayout;
