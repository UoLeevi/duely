import { useRef } from 'react';

export function useOnce<T>(callback: () => T): T {
  const firstRenderRef = useRef(true);
  let value: T | undefined = undefined;

  if (firstRenderRef.current) {
    value = callback();
    firstRenderRef.current = false;
  }

  const ref = useRef(value);
  return ref.current!;
}
