import { useState, useCallback } from 'react';

export function useRerender() {
  const [, setCounter] = useState(0);
  return useCallback(() => setCounter((i) => i + 1), []);
}
