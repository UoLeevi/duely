import { useRef, useEffect } from 'react';

const defaultOptions = { skip: false, retain: false };

export default function usePrevious(value, options = defaultOptions) {
  const ref = useRef(value);

  const { skip, retain } = { ...defaultOptions, ...options };
  useEffect(() => {
    if (retain && value == null) return;
    if (skip) return;
    ref.current = value;
  }, [value, skip, retain]);

  return ref.current;
}
