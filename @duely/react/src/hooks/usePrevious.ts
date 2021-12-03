import { useRef, useEffect } from 'react';

const defaultOptions = { skip: false, retain: false, returnTuple: false };

export function usePrevious<T>(
  value: T,
  options?: {
    skip?: boolean | ((previous?: T, value?: T) => boolean);
    retain?: boolean;
    returnTuple?: false;
  }
): T;
export function usePrevious<T>(
  value: T,
  options?: {
    skip?: boolean | ((previous?: T, value?: T) => boolean);
    retain?: boolean;
    returnTuple: true;
  }
): [T, { changed: boolean }];
export function usePrevious<T>(
  value: T,
  options: {
    skip?: boolean | ((previous?: T, value?: T) => boolean);
    retain?: boolean;
    returnTuple?: boolean;
  } = defaultOptions
) {
  const ref = useRef(value);
  const previous = ref.current;
  const { skip, retain, returnTuple } = { ...defaultOptions, ...options };

  // If value is equal to previous value, return previous value.
  if (value === previous) return returnTuple ? [previous, { changed: false }] : previous;
  
  // If value is null or undefined and should be retained, return previous value.
  if (retain && value == null) return returnTuple ? [previous, { changed: false }] : previous;
  
  // If value change should be skipped, return previous value.
  if (typeof skip === 'function' ? skip(previous, value) : skip)
    return returnTuple ? [previous, { changed: false }] : previous;

  // update previous value
  ref.current = value;

  // return previous value
  return returnTuple ? [previous, { changed: true }] : previous;
}
