import React, { useRef, useContext, useMemo, isValidElement } from 'react';
import { FormContext } from 'contexts/FormContext';
import './Form.css';
import Choose from 'components/Choose';
import Spinner from 'components/Spinner';

const Form = React.forwardRef(({ handleSubmit, className, children, loading, completed, error, areaWidth, areaHeight, ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;

  const elementCount = React.Children.count(children);
  const elementRefs = useMemo(() => Array.from({ length: elementCount }).map(() => React.createRef()), [elementCount]);
  children = React.Children.map(children, (element, i) => element?.ref ? element : React.cloneElement(element, { ref: elementRefs[i] }), [elementRefs, children]);

  const { validate } = useContext(FormContext);

  async function onSubmit(e) { 
    e.preventDefault();

    if (loading || completed) {
      return;
    }

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

  const messageStyle = { maxWidth: areaWidth, maxHeight: areaHeight };
  const areaStyle = { width: areaWidth, height: areaHeight };

  return (
    <Choose className="form-container" index={ completed ? 3 : loading ? 2 : error ? 1 : 0 } ref={ ref }>
      <form className={ className } onSubmit={ onSubmit } { ...props }>
        { children }
      </form>
      { error && <div className="form-error" style={ messageStyle }>{ isValidElement(error) ? error : <span className="f-2 f-b error">{ error }</span> }</div> }
      { loading && (isValidElement(loading) ? loading : <Spinner data-choose="fit" />) }
      { completed && <div className="form-completed" style={ messageStyle }>{ isValidElement(completed) ? completed : <span className="f-2 f-b success">{ completed }</span> }</div> }
      { <div style={ areaStyle }></div> }
    </Choose>
  );
});

export default Form;
