import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { FormContext } from 'contexts/FormContext';
import LoadingBar from 'components/LoadingBar';
import './Input.css';

const requiredMessage = 'Required';

const Input = React.forwardRef(({ name, label, type, subtype, hint, onChange, onBlur, getValue, setValue = () => {}, rules = [], completed = rules, loading, forceHint, actions, className, icon, children, options, ...props }, ref) => {
  const inputRef = useRef();
  const defaultRef = useRef();
  ref = ref ?? defaultRef;

  loading = !!loading;

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
      setValue(e.target.value);
    }
  }

  const validate = useCallback((value) => {
    if (typeof value !== 'string' || value.length > 0) {
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

  const { registerValidation } = useContext(FormContext);

  useEffect(() => {
    if (name === undefined) {
      return;
    }

    registerValidation(ref, () => {
      const value = getValue ? getValue(inputRef.current.value) : inputRef.current.value;

      if (typeof value !== 'string' || value.length > 0) {
        const isValid = validate(value);

        if (!isValid && !inputRef.current.hidden) {
          inputRef.current.focus();
        }

        return { isValid, loading, name, value };
      }

      if (inputRef.current.required) {
        ref.current.classList.add('invalid');

        if (requiredMessage !== hint) {
          setMessage(requiredMessage);
        }

        if (!inputRef.current.hidden) {
          inputRef.current.focus();
        }

        return { isValid: false, loading, name, value };
      }

      return { isValid: true, loading, name, value };
    });
  }, [ref, inputRef, name, hint, getValue, loading, registerValidation, validate]);

  className = Array.from(new Set(((className ?? '') + ' input').split(' '))).join(' ');
  const element = children && React.cloneElement(children, { className: (children.props.className ?? '') + ' input-element' });
  icon = icon && React.cloneElement(icon, { className: (icon.props.className ?? '') + ' input-icon' });
  const view = icon ? 'with-icon' : 'default';

  if (type === 'select') {
    options = options?.map(option => {
      const { value, element } = typeof option === 'object' ? option : { value: option };
      debugger;
      return <option key={ value } value={ value }>{ element ?? value }</option>;
    }) ?? [];
  }

  return (
    <label htmlFor={ `input-${name}` } className={ className } data-input={ view } ref={ ref }>
      <span className="input-label">{ label }</span>
      <div className="input-actions">
        { Object.entries(actions ?? {}).map(([text, onClick]) => 
          <span key={ text } onClick={ onClick }>{ text }</span>
        )}
      </div>
      { type === 'select'
        ? <select name={ name } id={ `input-${name}` } className="input-control" hidden={ element !== undefined } onBlur={ e => { validate(e.target.value); if (onBlur) onBlur(e); }} onChange={ processInput } spellCheck="false" autoComplete="off" children={ options } { ...props } ref={ inputRef } />
        : <input name={ name } id={ `input-${name}` } className="input-control" hidden={ element !== undefined } type={ type } onBlur={ e => { validate(e.target.value); if (onBlur) onBlur(e); }} onChange={ processInput } spellCheck="false" autoComplete="off" { ...props } ref={ inputRef } />
      }
      <div className="input-loading-bar">
        <LoadingBar loading={ loading } />
      </div>
      { element }
      { icon }
      <span className="input-message">{ message }</span>
    </label>
  )
});

export default Input;
