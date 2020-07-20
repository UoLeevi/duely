import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { FormValidationContext } from 'contexts/FormValidationContext';
import './TextField.css';

const requiredMessage = 'Required';

const TextField = React.forwardRef(({ label, type = 'text', hint, onChange, onBlur, text, setText = () => {}, rules = [], completed = rules, actions, className, ...props }, ref) => {
  const inputRef = useRef();
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

  const validate = useCallback((value) => {
    if (value.length > 0) {
      for (const rule of rules) {
        const message = rule(value);

        if (typeof message === 'string') {
          // validation failed
          ref.current.classList.add('invalid');
          setMessage(message);
          return false;
        }
      }

      if (rules.length > 0 && completed === rules) {
        // all rules passed and completed defaults to using rules
        ref.current.classList.add('completed');
        return true;
      }
    }

    if (typeof completed === 'function') {
      if (completed(value)) {
        ref.current.classList.add('completed');
      }
    } else if (completed !== rules && completed) {
      ref.current.classList.add('completed');
    }

    return true;
  }, [ref, rules, completed]);

  const { registerValidation } = useContext(FormValidationContext);

  useEffect(() => {
    registerValidation(ref, () => {
      if (inputRef.current.value.length > 0) {
        const isValid = validate(inputRef.current.value);

        if (!isValid) {
          inputRef.current.focus();
        }

        return isValid;
      }

      if (inputRef.current.required) {
        ref.current.classList.add('invalid');

        if (requiredMessage !== hint) {
          setMessage(requiredMessage);
        }

        inputRef.current.focus();
        return false;
      }
    })
  }, [ref, inputRef, hint, registerValidation, validate]);

  className = Array.from(new Set(((className ?? '') + ' text-field').split(' '))).join(' ');

  return (
    <label className={ className } data-input ref={ ref }>
      <span className="label">{ label }</span>
      <div className="text-field-actions">
        { Object.entries(actions ?? {}).map(([text, onClick]) => 
          <span key={ text } onClick={ onClick }>{ text }</span>
        )}
      </div>
      <input type={ type } onBlur={ e => { validate(e.target.value); if (onBlur) onBlur(e); }} onChange={ processInput } defaultValue={ text } spellCheck="false" { ...props } ref={ inputRef } />
      <span className="message">{ message }</span>
    </label>
  )
});

export default TextField;
