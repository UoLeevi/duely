import React, { isValidElement } from 'react';
import { Link } from 'react-router-dom';
import Choose from 'components/Choose';
import Spinner from 'components/Spinner';
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
    if (s) classNames += ' ' + s;
    if (l) classNames += ' ' + l;
  }

  return classNames;
}

const Button = ({ element, link, dense, prominent, filled, outlined, text, flat, error, loading, completed, className, areaWidth, areaHeight, color, ...props }) => {
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
    <Choose className="button-container" index={ completed ? 3 : loading ? 2 : error ? 1 : 0 }>
      { element }
      { error && (isValidElement(error) ? error : <div className="error f-2 f-b" style={ messageStyle }>{ error }</div>) }
      { loading && (isValidElement(loading) ? loading : <Spinner data-choose="fit" />) }
      { completed && (isValidElement(completed) ? completed : <div className="success f-2 f-b" style={ messageStyle }>{ completed }</div>) }
      { <div style={ areaStyle }></div> }
    </Choose>
  )
};

export default Button;
