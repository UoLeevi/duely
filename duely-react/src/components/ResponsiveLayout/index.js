import React from 'react';
import './ResponsiveLayout.css';
import useBreakpoints from 'hooks/useBreakpoints';

const ResponsiveLayout = ({ topbar, nav, aside, header, main, footer, ...props }) => {
  const { md } = useBreakpoints();

  function layoutPropFor(section) {
    const layout = {
      section
    };

    if (section === 'nav') {
      layout.orientation = md ? 'vertical' : 'horizontal';
    }

    return layout;
  }

  function createLayoutElement(element, section) {
    return element === undefined 
      ? undefined
      : typeof element.type === 'function'
        ? React.cloneElement(element, { layout: layoutPropFor(section) })
        : React.cloneElement(element, { 'data-layout': section });
  }

  return (
    <div className="responsive-layout" { ...props }>
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
};

export default ResponsiveLayout;
