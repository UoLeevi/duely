import React from 'react';
import Input from 'components/Input';

const SelectInput = React.forwardRef(({ type = 'select', options = [], className, ...props }, ref) => {

  className = Array.from(new Set(((className ?? '') + ' select-input').split(' '))).join(' ');

  return <Input className={ className } type={ type } options={['', ...options]} { ...props } ref={ ref } />
});

export default SelectInput;
