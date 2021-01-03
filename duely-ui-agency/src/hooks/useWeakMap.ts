import { useCallback, useRef, useState } from 'react';

function createReactiveWeakMap<K extends object, V>(target: {
  weakMap: WeakMap<K, V>;
  rerender: () => void;
}): WeakMap<K, V> {
  const _get = target.weakMap.get.bind(target.weakMap);
  const _has = target.weakMap.has.bind(target.weakMap);
  const _delete = (...args: Parameters<typeof target.weakMap.delete>) => {
    const res = target.weakMap.delete(...args);
    target.rerender();
    return res;
  };
  const _set = (...args: Parameters<typeof target.weakMap.set>) => {
    const res = target.weakMap.set(...args);
    target.rerender();
    return res;
  };

  const handler: ProxyHandler<typeof target> = {
    get(target, prop, receiver) {
      switch (prop) {
        case 'get':
          return _get;
        case 'has':
          return _has;
        case 'delete':
          return _delete;
        case 'set':
          return _set;
      }
    }
  };

  return (new Proxy(target, handler) as unknown) as WeakMap<K, V>;
}

export function useWeakMap<K extends object, V>(
  initializer?: null | (() => Iterable<[key: K, value: V]>)
): [WeakMap<K, V> | undefined, unknown] {
  const ref = useRef<WeakMap<K, V>>();
  const [dep, setDep] = useState(0);
  const rerender = useCallback(() => setDep((s) => ++s), []);

  if (!ref.current && initializer) {
    const target = {
      weakMap: new WeakMap(initializer()),
      rerender
    };

    ref.current = createReactiveWeakMap(target);
    rerender();
  }

  return [ref.current, dep];
}
