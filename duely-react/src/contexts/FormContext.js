import React, { createContext, useRef } from 'react';

export const FormContext = createContext();

const FormContextProvider = (props) => {
  const controlsRef = useRef(new WeakMap());

  function getControl(ref) {
    return controlsRef.current.get(ref) ?? {};
  }

  function validate(ref) {
    const { validate } = getControl(ref);
    return validate ? validate() : undefined;
  }

  function clear(ref) {
    const { clear } = getControl(ref);
    return clear ? clear() : undefined;
  }

  function getValue(ref) {
    const { getValue } = getControl(ref);
    return getValue ? getValue() : undefined;
  }

  function registerControl(ref, control) {
    controlsRef.current.set(ref, control);
  }

  return (
    <FormContext.Provider value={{ registerControl, validate, clear, getValue, getControl }}>
      { props.children }
    </FormContext.Provider>
  );
}

export function withFormContext(Fn) {
  return (
    <FormContextProvider>
      <Fn />
    </FormContextProvider>
  );
}

export default FormContextProvider;
