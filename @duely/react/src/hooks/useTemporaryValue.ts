import { useRef, useState, useCallback, useEffect } from 'react';

export function useTemporaryValue<T>(defaultDurationMs: number) {
  const timeoutRef = useRef<number>();
  const isMountedRef = useRef<boolean>();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [value, setValue] = useState<T>();
  return {
    value,
    setValue: useCallback(
      (value: T, durationMs?: number) => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
          timeoutRef.current = undefined;
          if (isMountedRef.current) setValue(undefined);
        }, durationMs ?? defaultDurationMs);

        setValue(value);
      },
      [defaultDurationMs]
    ),
    reset: useCallback(() => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = undefined;
      if (isMountedRef.current) setValue(undefined);
    }, [])
  };
}
