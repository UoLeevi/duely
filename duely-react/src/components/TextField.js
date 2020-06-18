import React from 'react';

const TextField = ({ label, type, onChange, text, setText }) => (
  <label className="default grow-1">
    <span>{ label }</span>
    <input type={ type } onChange={ onChange || ((e) => { e.preventDefault(); setText(e.target.value); }) } defaultValue={ text } />
  </label>
);

export default TextField;
