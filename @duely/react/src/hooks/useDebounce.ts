import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (value === debouncedValue) return;
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
}


