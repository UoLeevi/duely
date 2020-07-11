import React from 'react';

const TextField = ({ label, type = 'text', onChange, text, setText = () => {}, autoFocus, ...props }) => (
  <label className="default grow-1" { ...props }>
    <span>{ label }</span>
    <input type={ type } onChange={ onChange || ((e) => { e.preventDefault(); setText(e.target.value); }) } defaultValue={ text } spellCheck="false" autoFocus={ autoFocus } />
  </label>
);

export default TextField;
