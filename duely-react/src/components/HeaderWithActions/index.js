import React from 'react';
import withAnimatedTransition from 'hoc/withAnimatedTransition';
import './HeaderWithActions.css';

const HeaderWithActions = ({ layout: { section }, title, subtitle, children, ...props }) => {
  return (
    <header className="header-with-actions pa-4" data-layout={ section } { ...props }>
      <h2 className="f-4b">{ title }</h2>
      <h3 className="f-3b background color-l1n">{ subtitle }</h3>
      <div>{ children }</div>
    </header>
  );
};

export default withAnimatedTransition(
  HeaderWithActions,
  { shouldTransition: (prevProps, props) => prevProps.title !== props.title || prevProps.subtitle !== props.subtitle });
