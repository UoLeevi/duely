import React from 'react';
import TransitionElement from 'components/TransitionElement';
import './HeaderWithActions.css';

const HeaderWithActions = ({ layout: { section }, title, subtitle, children }) => {
  return (
    <TransitionElement tag="header" className="header-with-actions gutter py-4" data-layout={ section } compare={ title + subtitle }>
      <h2 className="f-4b">{ title }</h2>
      <h3 className="f-3b background color-l1n">{ subtitle }</h3>
      <div>{ children }</div>
    </TransitionElement>
  );
};

export default HeaderWithActions;
