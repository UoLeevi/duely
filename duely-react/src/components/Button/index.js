import React, { isValidElement, useRef } from 'react';
import Link from 'components/Link';
import Choose from 'components/Choose';
import LoadingSpinner from 'components/LoadingSpinner';
import './Button.css';

function getColorClassNames(modifiers, color) {
  if (!color) {
    return modifiers.includes('filled')
      ? ' surface-bg bg-l4'
      : '';
  }

  const c = /([^\s-]*)/.exec(color)?.[1];
  const s = /(s\dn?)/.exec(color)?.[1];
  const l = /(l\dn?)/.exec(color)?.[1];
  let classNames = '';

  if (modifiers.includes('filled')) {
    if (c) {
      classNames += ' ' + c + '-bg';

      if ((l?.length ?? 2) === 2) classNames += ' white';
    }

    if (s) classNames += ' bg-' + s;
    if (l) classNames += ' bg-' + l;
  } else {
    if (c) classNames += ' ' + c;
    if (s) classNames += ' color-' + s;
    if (l) classNames += ' color-' + l;
  }

  return classNames;
}

const Button = React.forwardRef(({ element, link, dense, prominent, filled, outlined, text, flat, error, loading, completed, className, areaWidth, areaHeight, color, ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;

  let modifiers = Object
    .entries({ filled, outlined, text, flat })
    .filter(([, v]) => v)
    .map(([k,]) => k);

  modifiers = modifiers.length ? modifiers : ['default'];

  modifiers = [...modifiers, ...Object
    .entries({ dense, prominent })
    .filter(([, v]) => v)
    .map(([k,]) => k)];

  className = Array.from(new Set(((className ?? '') + ' button' + getColorClassNames(modifiers, color)).split(' '))).join(' ');
  props = { className, 'data-button': modifiers.join(' '), ...props };

  element = element 
    ? React.cloneElement(element, props)
    : link
      ? <Link { ...props } { ...link } />
      : <button { ...props } />;

  const messageStyle = { maxWidth: areaWidth, maxHeight: areaHeight };
  const areaStyle = { width: areaWidth, height: areaHeight };

  return (
    <Choose className="button-container" index={ completed ? 3 : loading ? 2 : error ? 1 : 0 } ref={ ref }>
      { element }
      { error && <div className="button-error" style={ messageStyle }>{ isValidElement(error) ? error : <span className="f-2 f-b error">{ error }</span> }</div> }
      { loading && (isValidElement(loading) ? loading : <LoadingSpinner data-choose="fit" />) }
      { completed && <div className="button-completed" style={ messageStyle }>{ isValidElement(completed) ? completed : <span className="f-2 f-b success">{ completed }</span> }</div> }
      { <div style={ areaStyle }></div> }
    </Choose>
  )
});

export default Button;
