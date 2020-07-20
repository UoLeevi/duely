import React, { createContext, useRef } from 'react';

export const FormContext = createContext();

const FormContextProvider = (props) => {
  const validationsRef = useRef(new WeakMap());

  function validate(ref) {
    const validate = validationsRef.current.get(ref);
    return validate ? validate() : undefined;
  }

  function registerValidation(ref, validation) {
    validationsRef.current.set(ref, validation);
  }

  return (
    <FormContext.Provider value={{ registerValidation, validate }}>
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
