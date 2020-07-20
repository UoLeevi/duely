import React, { useRef, useContext, useMemo } from 'react';
import { FormValidationContext } from 'contexts/FormValidationContext';
import './Form.css';

const Form = React.forwardRef(({ handleSubmit, className, children, ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;

  const elementCount = React.Children.count(children);
  const elementRefs = useMemo(() => Array.from({ length: elementCount }).map(() => React.createRef()), [elementCount]);
  children = React.Children.map(children, (element, i) => element?.ref ? element : React.cloneElement(element, { ref: elementRefs[i] }), [elementRefs, children]);

  const { validate } = useContext(FormValidationContext);

  async function onSubmit(e) { 
    e.preventDefault();

    for (const element of React.Children.toArray(children)) {
      const ref = element?.ref;

      if (ref) {
        const isValid = validate(ref);

        if (!isValid) {
          return;
        }
      }
    }

    if (handleSubmit) {
      await handleSubmit(e);
    }
  }

  className = Array.from(new Set(((className ?? '') + ' form').split(' '))).join(' ');

  return (
    <form className={ className } onSubmit={ onSubmit } { ...props } ref={ ref }>
      { children }
    </form>
  );
});

export default Form;
