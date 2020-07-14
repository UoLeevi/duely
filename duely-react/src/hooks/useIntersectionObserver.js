import { useRef, useEffect } from 'react';

export default function useIntersectionObserver(targetRef, callback, options = {}) {
  const ref = useRef(() => undefined);
  useEffect(() => {
    if (!targetRef.current) {
      return () => undefined;
    }

    const observer = new IntersectionObserver(entries => callback(entries[0]), options);
    observer.observe(targetRef.current);
    const unobserve = () => observer.disconnect();
    ref.current = unobserve;
    return unobserve;
  }, [targetRef, callback, options]);

  return ref.current;
}
