import { PathValue, SplitString } from '..';
import {
  GenericFunction,
  LeadingTypes,
  NotFunction,
  PartialApplication,
  ResolvableValue
} from '../types';

export function byteToHex(x: number) {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

export function hexToByte(x: string) {
  return parseInt(x, 16);
}

export function createClassName(...classNames: any[]) {
  return Array.from(
    new Set(
      classNames
        .filter(isString)
        .join(' ')
        .split(' ')
        .filter((c) => !!c)
    )
  ).join(' ');
}

export function formatFileSize(size: number) {
  if (size < 1000) return `${size.toFixed(0)}B`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}KB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}MB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}GB`;
}

export function getNameInitials(name: string) {
  const initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

export function randomKey(length?: number, seed?: number) {
  length ??= 32;
  seed ??= pseudoRandom(seed);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let r = '';

  for (let i = 0; i < length; ++i) {
    r += characters[Math.floor(pseudoRandom(seed + i) * characters.length)];
  }

  return r;
}

export function pseudoRandom(seed?: number) {
  const x = Math.sin(seed || Math.random()) * 10000;
  return x - Math.floor(x);
}

export function poisson(mean: number, generateRandom?: () => number) {
  const L = Math.exp(-mean);
  let p = 1.0;
  let k = 0;
  generateRandom = generateRandom ?? Math.random;

  do {
    k++;
    p *= generateRandom();
  } while (p > L);

  return k - 1;
}

export function truncate(text: string, maxLength: number) {
  return text?.length > maxLength ? text.substring(0, maxLength).trimEnd() + '...' : text;
}

export function sentenceCase(text: string) {
  return text && text.charAt(0).toUpperCase() + text.substring(1);
}

export function mimeTypeFromDataUrl(dataUrl: string) {
  return dataUrl.slice(5, dataUrl.indexOf(';'));
}

export function diff<TFrom, TOmit>(
  fromObject: TFrom,
  omitObject: TOmit
): {
  [K in keyof TFrom]: K extends keyof TOmit
    ? TFrom[K] extends TOmit[K]
      ? TOmit[K] extends TFrom[K]
        ? never
        : TFrom[K]
      : TFrom[K]
    : TFrom[K];
} {
  return Object.fromEntries(
    Object.entries(fromObject).filter(
      ([key, value]) => omitObject?.[key as keyof typeof omitObject] !== value
    )
  ) as any;
}

export function getPathValue<T, TPath extends string | readonly string[]>(
  obj: T,
  path: TPath
): PathValue<T, TPath> {
  const parts: readonly string[] = typeof path === 'string' ? path.split('.') : path;
  return parts.reduce((prev, key) => prev?.[key], obj as any);
}

export function template(template: string, variables: Record<string, any>) {
  return template.replace(
    /{(.*?)}/g,
    (_, placeholder: string) =>
      getPathValue(variables, placeholder.trim())?.toString() ?? placeholder
  );
}

export function isPrivateIp(hostname: string) {
  var parts = hostname.split('.').map((part) => parseInt(part, 10));
  if (parts.length !== 4 || parts.some(isNaN)) return false;

  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

export function omitUndefined<T extends object>(
  obj: T
): {
  [K in keyof T]: T[K] extends undefined ? never : T[K];
} {
  return Object.fromEntries(Object.entries(obj).filter((entry) => entry[1] !== undefined)) as any;
}

export function createUpdateArgs<T extends Record<string, unknown>>(
  original: T,
  changed: Partial<T>
) {
  return omitUndefined(diff(pick(changed, original), original));
}

export function hasOwnProperty<T, TKey extends PropertyKey>(
  obj: T,
  propertyName: TKey
): obj is T & Record<TKey, unknown> {
  return obj === Object(obj) && Object.prototype.hasOwnProperty.call(obj, propertyName);
}

export function hasProperty<T, TKey extends PropertyKey>(
  obj: T,
  propertyName: TKey
): obj is T & Record<TKey, unknown> {
  return obj === Object(obj) && propertyName in obj;
}

export function isFunction<R = any, TArgs extends any[] = any[]>(
  value: NotFunction<R> | GenericFunction<R, TArgs>
): value is GenericFunction<R, TArgs> {
  return typeof value === 'function';
}

export function isString(arg: any): arg is string {
  return typeof arg === 'string';
}

export function hasMethod<T, TKey extends PropertyKey>(
  obj: T,
  methodName: TKey
): obj is T & Record<TKey, Function> {
  return typeof (obj as any)?.[methodName] === 'function';
}

export async function resolve<R = any, TArgs extends unknown[] = any[]>(
  value: ResolvableValue<R, TArgs>,
  ...args: TArgs
): Promise<R> {
  return await (isFunction(value) ? value(...args) : value);
}

export function identity<T = any>(arg: T): T {
  return arg;
}

export function partial<R, TParams extends readonly unknown[]>(
  func: GenericFunction<R, TParams>,
  ...partials: LeadingTypes<TParams>
): GenericFunction<R, PartialApplication<TParams, typeof partials>> {
  return (...rest) => {
    // TODO: unable to make the typing work so let's use help of `any`.
    const args: TParams = [...partials, ...rest] as any;
    return func(...args);
  };
}

export function pick<TFrom extends object, TKeys extends string, T extends Record<TKeys, unknown>>(
  fromObject: TFrom,
  keys: TKeys[] | T
): {
  [TKey in keyof T]: TKey extends keyof TFrom ? TFrom[TKey] : undefined;
} {
  const keysArray = Array.isArray(keys) ? keys : (Object.keys(keys) as TKeys[]);
  const obj = {};

  for (const key of keysArray) {
    (obj as any)[key] = (fromObject as any)[key];
  }

  return obj as any;
}

export function memo<R, TParams extends unknown[]>(
  func: GenericFunction<R, TParams>
): typeof func & { invalidate: () => void } {
  let cache = new Map();
  const memoizedFunc: typeof func & { invalidate: () => void } = (...args) => {
    let node = cache;

    // Let's ignore trailing arguments with undefined value

    let last = args.length - 1;

    while (last >= 0 && args[last] === undefined) {
      --last;
    }

    // If there are no arguments, let's return cached value if it exists

    if (last === -1) {
      if (node.has(last)) {
        return node.get(last);
      } else {
        const result = func(...args);
        node.set(last, result);
        return result;
      }
    }

    // Separate cache Map objects are used when function is called with different number of arguments

    let nextNode = node.get(last);

    if (nextNode === undefined) {
      nextNode = new Map();
      node.set(last, nextNode);
    }

    node = nextNode;

    // For each positional argument except last, get or create nested cache Map object based on value

    for (let i = 0; i < last; ++i) {
      const arg = args[i];
      nextNode = node.get(arg);

      if (nextNode === undefined) {
        nextNode = new Map();
        node.set(arg, nextNode);
      }

      node = nextNode;
    }

    // For last argument value, get cached return value or call the function once and cache the value

    const arg = args[last];

    if (node.has(arg)) {
      return node.get(arg);
    } else {
      const result = func(...args);
      node.set(arg, result);
      return result;
    }
  };

  memoizedFunc.invalidate = () => {
    cache = new Map();
  };

  return memoizedFunc;
}

export function lazy<R extends object, TParams extends unknown[]>(
  initializer: GenericFunction<R, TParams>,
  ...args: TParams
): R {
  let isInitialized = false;
  let result: R;
  const methods = new Map();

  function getResult(): R {
    if (!isInitialized) {
      isInitialized = true;
      result = initializer(...args);
    }

    return result;
  }

  return new Proxy<GenericFunction<R, TParams>, R>(initializer, {
    get(target, p, receiver) {
      const result = getResult();
      const value = Reflect.get(result, p, receiver === target ? result : receiver);
      if (typeof value !== 'function') return value;
      let method = methods.get(value);

      if (method === undefined) {
        method = value.bind(result);
        methods.set(value, method);
      }

      return method;
    },
    set(target, p, value, receiver) {
      const result = getResult();
      return Reflect.set(result, p, value, receiver === target ? result : receiver);
    },
    apply(target, thisArg, ...args) {
      const result = getResult();
      Reflect.apply(result as Function, thisArg === target ? result : thisArg, ...args);
    },
    construct: (_, ...args) => Reflect.construct(getResult() as Function, ...args),
    defineProperty: (_, ...args) => Reflect.defineProperty(getResult(), ...args),
    deleteProperty: (_, ...args) => Reflect.deleteProperty(getResult(), ...args),
    getOwnPropertyDescriptor: (_, ...args) =>
      Reflect.getOwnPropertyDescriptor(getResult(), ...args),
    getPrototypeOf: (_, ...args) => Reflect.getPrototypeOf(getResult(), ...args),
    has: (_, ...args) => Reflect.has(getResult(), ...args),
    isExtensible: (_, ...args) => Reflect.isExtensible(getResult(), ...args),
    ownKeys: (_, ...args) => Reflect.ownKeys(getResult(), ...args),
    preventExtensions: (_, ...args) => Reflect.preventExtensions(getResult(), ...args),
    setPrototypeOf: (_, ...args) => Reflect.setPrototypeOf(getResult(), ...args)
  });
}

declare global {
  interface ProxyConstructor {
    new <TSource extends object, TTarget extends object>(
      target: TSource,
      handler: ProxyHandler<TSource>
    ): TTarget;
  }
}
