import { useEffect } from 'react'
import { usePromise } from './usePromise';

export function useScript(src: string): Promise<Event> {
  const [promise, resolve, reject] = usePromise<Event>();
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [src]);

  return promise;
}
