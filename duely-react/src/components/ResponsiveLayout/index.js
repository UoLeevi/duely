import React from 'react';
import './ResponsiveLayout.css';
import useBreakpoints from 'hooks/useBreakpoints';
import withAnimatedTransition from 'hoc/withAnimatedTransition';
import AnimatedTransition from 'components/AnimatedTransition';

const didTypeChange = (previous, next) => previous.type !== next.type;
const didCriticalSectionsChange = (previous, next) => {  
  if (!previous.nav !== !next.nav) {
    return true;
  }

  return false;
};

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
      <AnimatedTransition shouldTransition={ didTypeChange }>
        { createLayoutElement(topbar, 'topbar') }
      </AnimatedTransition>
      <AnimatedTransition shouldTransition={ didTypeChange }>
        { createLayoutElement(nav, 'nav') }
      </AnimatedTransition>
      <AnimatedTransition shouldTransition={ didTypeChange }>
        { createLayoutElement(aside, 'aside') }
      </AnimatedTransition>
      <div className="body">
        <AnimatedTransition shouldTransition={ didTypeChange }>
          { createLayoutElement(header, 'header') }
        </AnimatedTransition>
        <AnimatedTransition shouldTransition={ didTypeChange }>
          { createLayoutElement(main, 'main') }
        </AnimatedTransition>
        <AnimatedTransition shouldTransition={ didTypeChange }>
          { createLayoutElement(footer, 'footer') }
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default withAnimatedTransition(ResponsiveLayout, { shouldTransition: didCriticalSectionsChange });
