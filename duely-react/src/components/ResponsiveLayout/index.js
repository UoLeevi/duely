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

const ResponsiveLayout = React.forwardRef(({ topbar, nav, aside, header, main, footer, ...props }, ref) => {
  const { md } = useBreakpoints();

  function layoutModifiersFor(section) {
    const modifiers = [];

    if (section === 'nav') {
      modifiers.push(`orientation-${ md ? 'vertical' : 'horizontal' }`);
    }

    return modifiers.length === 0 ? '' : '-' + modifiers.join(';');
  }

  function createLayoutElement(element, section) {
    return element && React.cloneElement(element, { 'data-layout': section + layoutModifiersFor(section) });
  }

  return (
    <div className="responsive-layout" ref={ ref } { ...props }>
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
});

export default withAnimatedTransition(ResponsiveLayout, { shouldTransition: didCriticalSectionsChange });
