import React from 'react';
import AnimatedTransition from 'components/AnimatedTransition';
import './HeaderWithActions.css';

const HeaderWithActions = React.forwardRef(({ title, subtitle, children, ...props }, ref) => {
  return (
    <header className="header-with-actions py-4 g-2" { ...props } ref={ ref }>
      <AnimatedTransition>
        <h2 className="f-6 f-b">{ title }</h2>
      </AnimatedTransition>
      <AnimatedTransition>
        <h3 className="f-4 f-b surface color-l2">{ subtitle }</h3>
      </AnimatedTransition>
      <div>{ children }</div>
    </header>
  );
});

export default HeaderWithActions;
