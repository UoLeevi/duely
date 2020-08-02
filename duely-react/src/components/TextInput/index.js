import React from 'react';
import Input from 'components/Input';

const TextInput = React.forwardRef(({ type = 'text', ...props }, ref) => {
  return <Input type={ type } { ...props } ref={ ref } />
});

export default TextInput;
