import React from 'react';
import useBreakpoints from 'hooks/useBreakpoints';
import './SplitLayout.css';

// # layout section modifiers
// - collapse-sm:     hides section on smaller screens
// - center:          centers content horizontally and vertically
// - [integer][unit]: column width (default is 1fr)

function layoutModifiersFor(element, section) {
  const modifiers = element?.props?.['data-layout']?.split(' ') ?? [];

  return modifiers.length === 0 ? '' : '- ' + modifiers.join(' ');
}

function createLayoutElement(element, section, breakpoints) {
  if (!breakpoints.md) {
    const modifiers = element?.props?.['data-layout']?.split(' ') ?? [];
    
    if (modifiers.includes('collapse-sm')) {
      return null;
    }
  }

  return element && React.cloneElement(element, { 'data-layout': section + layoutModifiersFor(element, section) });
}

function getColumnWidth(element) {
  const modifiers = element?.props?.['data-layout']?.split(' ') ?? [];
  return modifiers.find(m => parseInt(m[0])) ?? '1fr';
}

const SplitLayout = React.forwardRef(({ left, right, style, ...props }, ref) => {
  const breakpoints = useBreakpoints();
  style = { ...style, gridTemplateColumns: `minmax(auto, ${getColumnWidth(left)}) minmax(auto, ${getColumnWidth(right)})` }

  return (
    <div className="split-layout" style={ style } ref={ ref } { ...props }>
      { createLayoutElement(left, 'left', breakpoints) }
      { createLayoutElement(right, 'right', breakpoints) }
    </div>
  );
});

export default SplitLayout;
