import React from 'react';
import './TextField.css';

const TextField = ({ label, type = 'text', onChange, text, setText = () => {}, autoFocus, actions, className, ...props }) => {
  className = Array.from(new Set(((className ?? '') + ' text-field default').split(' '))).join(' ');

  return (
    <label className={ className } { ...props }>
      <span>{ label }</span>
      <div className="text-field-actions">
        { Object.entries(actions ?? {}).map(([text, onClick]) => 
          <span className="button text primary" key={ text } onClick={ onClick }>{ text }</span>
        )}
      </div>
      <input type={ type } onChange={ onChange || ((e) => { e.preventDefault(); setText(e.target.value); }) } defaultValue={ text } spellCheck="false" autoFocus={ autoFocus } />
    </label>
  )
};

export default TextField;
