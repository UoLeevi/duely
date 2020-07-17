import React from 'react';
import './ResponsiveLayout.css';
import useBreakpoints from 'hooks/useBreakpoints';

const ResponsiveLayout = React.forwardRef(({ topbar, nav, aside, header, main, footer, ...props }, ref) => {
  const { md } = useBreakpoints();

  function layoutModifiersFor(element, section) {
    const modifiers = element?.props?.['data-layout']?.split(' ') ?? [];

    if (section === 'nav') {
      modifiers.push(`orientation:${ md ? 'vertical' : 'horizontal' }`);
    }

    return modifiers.length === 0 ? '' : '- ' + modifiers.join(' ');
  }

  function createLayoutElement(element, section) {
    return element && React.cloneElement(element, { 'data-layout': section + layoutModifiersFor(element, section) });
  }

  return (
    <div className="responsive-layout" ref={ ref } { ...props }>
      { createLayoutElement(topbar, 'topbar') }
      { createLayoutElement(nav, 'nav') }
      { createLayoutElement(aside, 'aside') }
      <div className="body">
        { createLayoutElement(header, 'header') }
        { createLayoutElement(main, 'main') }
        { createLayoutElement(footer, 'footer') }
      </div>
    </div>
  );
});

export default ResponsiveLayout;
