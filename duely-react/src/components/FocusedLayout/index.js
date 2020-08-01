import React from 'react';
import './FocusedLayout.css';

// # layout section modifiers
// TODO

function layoutModifiersFor(element, section) {
  const modifiers = element?.props?.['data-layout']?.split(' ') ?? [];

  return modifiers.length === 0 ? '' : '- ' + modifiers.join(' ');
}

function createLayoutElement(element, section) {
  return element && React.cloneElement(element, { 'data-layout': section + layoutModifiersFor(element, section) });
}

const FocusedLayout = React.forwardRef(({ topbar, header, main, actions, ...props }, ref) => {
  return (
    <div className="focused-layout" ref={ ref } { ...props }>
      { createLayoutElement(topbar, 'topbar') }
      { createLayoutElement(header, 'header') }
      { createLayoutElement(main, 'main') }
      { createLayoutElement(actions, 'actions') }
    </div>
  );
});

export default FocusedLayout;
