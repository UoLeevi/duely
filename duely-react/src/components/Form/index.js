import React, { useRef, useContext, useMemo } from 'react';
import { FormContext } from 'contexts/FormContext';
import './Form.css';

const Form = React.forwardRef(({ handleSubmit, className, children, ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;

  const elementCount = React.Children.count(children);
  const elementRefs = useMemo(() => Array.from({ length: elementCount }).map(() => React.createRef()), [elementCount]);
  children = React.Children.map(children, (element, i) => element?.ref ? element : React.cloneElement(element, { ref: elementRefs[i] }), [elementRefs, children]);

  const { validate } = useContext(FormContext);

  async function onSubmit(e) { 
    e.preventDefault();

    const data = {};

    for (const element of React.Children.toArray(children)) {
      const ref = element?.ref;

      if (ref) {
        const { isValid, key, value } = validate(ref) ?? {};

        if (key === undefined) {
          continue;
        }

        if (!isValid) {
          return;
        }

        data[key] = value;
      }
    }

    if (handleSubmit) {
      await handleSubmit(data);
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
