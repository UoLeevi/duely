import React, { createContext, useRef } from 'react';

export const FormValidationContext = createContext();

const FormValidationContextProvider = (props) => {
  const validationsRef = useRef(new WeakMap());

  function validate(ref) {
    const validate = validationsRef.current.get(ref);
    return validate ? validate() : true;
  }

  function registerValidation(ref, validation) {
    validationsRef.current.set(ref, validation);
  }

  return (
    <FormValidationContext.Provider value={{ registerValidation, validate }}>
      { props.children }
    </FormValidationContext.Provider>
  );
}

export function withFormValidationContext(Fn) {
  return (
    <FormValidationContextProvider>
      <Fn />
    </FormValidationContextProvider>
  );
}

export default FormValidationContextProvider;
