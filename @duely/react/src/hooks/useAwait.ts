import { hasMethod } from '@duely/util';
import { useEffect, useRef } from 'react';
import { useRerender } from '..';

const defaultValue = { value: undefined, loading: false, error: undefined };

export function useAwait<T>(promise: Promise<T> | T) {
  const rerender = useRerender();
  const promiseRef = useRef(promise);
  const resultRef =
    useRef<{ value: T | undefined; loading: boolean; error: Error | undefined }>(defaultValue);

  if (promiseRef.current !== promise) {
    resultRef.current = { value: undefined, loading: true, error: undefined };
    promiseRef.current = promise;
  }

  const isPromise = hasMethod(promise, 'then');

  if (!isPromise) {
    resultRef.current = { value: promise, loading: false, error: undefined };
  }

  useEffect(() => {
    if (!isPromise) return;
    promise
      .then((value) => {
        if (resultRef.current.value === value) return;
        resultRef.current = { value, loading: false, error: undefined };
        rerender();
      })
      .catch((error) => {
        resultRef.current = { value: undefined, loading: false, error };
        rerender();
      });
  }, [isPromise, promise, rerender]);

  return resultRef.current;
}
