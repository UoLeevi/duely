import React from 'react';
import AnimatedTransition from 'components/AnimatedTransition';
import './HeaderWithActions.css';

const HeaderWithActions = React.forwardRef(({ title, subtitle, children, ...props }, ref) => {
  return (
    <header className="header-with-actions pa-4" { ...props } ref={ ref }>
      <AnimatedTransition>
        <h2 className="f-4b">{ title }</h2>
      </AnimatedTransition>
      <AnimatedTransition>
        <h3 className="f-3b background color-l1n">{ subtitle }</h3>
      </AnimatedTransition>
      <div>{ children }</div>
    </header>
  );
});

export default HeaderWithActions;
