import { useState } from 'react';

export default function usePrevious(value) {
  const [previousValue, setPreviousValue] = useState();

  if (value !== previousValue) {
    setPreviousValue(value);
  }

  return previousValue;
}
