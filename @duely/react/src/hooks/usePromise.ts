import { useOnce } from './useOnce';

function createPromise<T>(): [
  promise: Promise<T>,
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
] {
  let outsideResolve: (value: T | PromiseLike<T>) => void;
  let outsideReject: (reason?: any) => void;
  const promise = new Promise<T>((resolve, reject) => {
    outsideResolve = resolve;
    outsideReject = reject;
  });
  return [promise, outsideResolve!, outsideReject!];
}

export function usePromise<T>(): [
  promise: Promise<T>,
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
] {
  return useOnce(() => createPromise<T>());
}
