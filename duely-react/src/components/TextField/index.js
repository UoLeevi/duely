import React, { useState, useRef } from 'react';
import './TextField.css';

const TextField = React.forwardRef(({ label, type = 'text', hint, onChange, onBlur, text, setText = () => {}, rules = [], completed = rules, actions, className, ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;

  const [message, setMessage] = useState(hint);

  function processInput(e) {
    ref.current.classList.remove('invalid');
    ref.current.classList.remove('completed');

    if (message !== hint) {
      setMessage(hint);
    }

    if (onChange) {
      onChange(e)
    } else {
      e.preventDefault();
      setText(e.target.value);
    }
  }

  function validate(e) {
    if (e.target.value.length > 0) {
      for (const rule of rules) {
        const message = rule(e.target.value);

        if (typeof message === 'string') {
          // validation failed
          ref.current.classList.add('invalid');
          setMessage(message);

          if (onBlur) onBlur(e);
          return;
        }
      }

      if (rules.length > 0 && completed === rules) {
        // all rules passed and completed defaults to using rules
        ref.current.classList.add('completed');

        if (onBlur) onBlur(e);
        return;
      }
    }

    if (typeof completed === 'function') {
      if (completed(e.target.value)) {
        ref.current.classList.add('completed');
      }
    } else if (completed !== rules && completed) {
      ref.current.classList.add('completed');
    }

    if (onBlur) onBlur(e);
    return;
  }

  className = Array.from(new Set(((className ?? '') + ' text-field').split(' '))).join(' ');

  return (
    <label className={ className } ref={ ref }>
      <span className="label">{ label }</span>
      <div className="text-field-actions">
        { Object.entries(actions ?? {}).map(([text, onClick]) => 
          <span key={ text } onClick={ onClick }>{ text }</span>
        )}
      </div>
      <input type={ type } onBlur={ validate } onChange={ processInput } defaultValue={ text } spellCheck="false" { ...props } />
      <span className="message">{ message }</span>
    </label>
  )
});

export default TextField;
