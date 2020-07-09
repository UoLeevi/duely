import { useRef, useEffect } from 'react';

const defaultOptions = { skip: false }

export default function usePrevious(value, options = defaultOptions ) {
  const ref = useRef(value);

  const { skip } = { ...defaultOptions, ...options }
  useEffect(() => {
    if (!skip) {
      ref.current = value;
    }
  }, [value, skip]);

  return ref.current;
}
