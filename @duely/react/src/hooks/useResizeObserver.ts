import { useRef, useEffect } from 'react';

export function useResizeObserver(
  targetRef: React.RefObject<HTMLElement>,
  callback: (entry: ResizeObserverEntry) => void,
  options: ResizeObserverOptions = {}
) {
  const ref = useRef<() => void>(() => undefined);
  useEffect(() => {
    if (!targetRef?.current) {
      return () => undefined;
    }

    const observer = new ResizeObserver((entries) => callback(entries[0]));
    observer.observe(targetRef.current, options);
    const unobserve = () => observer.disconnect();
    ref.current = unobserve;
    return unobserve;
  }, [targetRef, callback, options]);

  return ref.current;
}
