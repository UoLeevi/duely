import React from 'react';
import Input from 'components/Input';
import { createClassName } from 'utils';

const SelectInput = React.forwardRef(({ type = 'select', options = [], className, ...props }, ref) => {
  className = createClassName(className, 'select-input');
  return <Input className={ className } type={ type } options={['', ...options]} { ...props } ref={ ref } />
});

export default SelectInput;
