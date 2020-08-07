import React, { useRef } from 'react';
import VerifyAuth from 'components/VerifyAuth';
import useBackgroundColor from 'hooks/useBackgroundColor';

const DuelyRoot = React.forwardRef(({ ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;
  useBackgroundColor(ref, 'l9');
  return (
    <VerifyAuth { ...props } ref={ ref } />
  );
});

export default DuelyRoot;
