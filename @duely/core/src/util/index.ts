export type NotFunction<T> = T extends Function ? never : T;
export type GenericFunction<R = any, TArgs extends any[] = any[]> = (...args: TArgs) => R;
export type ResolvableValue<R = any, TArgs extends any[] = any[]> =
  | NotFunction<R | PromiseLike<R>>
  | GenericFunction<R | PromiseLike<R>, TArgs>;

export type ResolvedType<T> = T extends ResolvableValue<infer U, unknown[]> ? U : never;
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type ElementType<T extends unknown[]> = T extends readonly (infer U)[] ? U : never;
export type Head<T extends unknown[]> = T extends [infer U, ...unknown[]] ? U : never;
export type Tail<T extends unknown[]> = T extends [unknown, ...infer U] ? U : never;
export type Concat<T extends unknown[], U extends unknown[]> = U extends []
  ? T
  : Concat<[...T, Head<U>], Tail<U>>;

export type ExcludingLast<T extends unknown[]> = T extends [...infer U, unknown] ? U : never;
export type LeadingTypes<T extends unknown[]> = T extends []
  ? T
  : T | LeadingTypes<ExcludingLast<T>>;

export type TrailingTypes<T extends unknown[]> = T extends [] ? T : T | TrailingTypes<Tail<T>>;
export type PartialApplication<
  T extends unknown[],
  TPartials extends LeadingTypes<T>
> = TPartials extends []
  ? T
  : Head<TPartials> extends Head<T>
  ? Tail<TPartials> extends LeadingTypes<Tail<T>>
    ? PartialApplication<Tail<T>, Tail<TPartials>>
    : never
  : never;

export namespace Util {
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

  export function partial<R, TParams extends unknown[]>(
    func: GenericFunction<R, TParams>,
    ...partials: LeadingTypes<TParams>
  ): GenericFunction<R, PartialApplication<Parameters<typeof func>, typeof partials>> {
    return (...rest) => {
      // TODO: unable to make the typing work so let's use help of `any`.
      const args: TParams = [...partials, ...rest] as any;
      return func(...args);
    };
  }

  export function memo<R, TParams extends unknown[]>(
    func: GenericFunction<R, TParams>
  ): typeof func {
    const cache = new Map();
    return (...args) => {
      let node = cache;
      const last = args.length - 1;

      if (last === -1) {
        if (node.has(last)) {
          return node.get(last);
        } else {
          const result = func(...args);
          node.set(last, result);
          return result;
        }
      }

      let nextNode = node.get(last);

      if (nextNode === undefined) {
        nextNode = new Map();
        node.set(last, nextNode);
      }

      node = nextNode;

      for (let i = 0; i < last; ++i) {
        const arg = args[i];
        nextNode = node.get(arg);

        if (nextNode === undefined) {
          nextNode = new Map();
          node.set(arg, nextNode);
        }

        node = nextNode;
      }

      const arg = args[last];

      if (node.has(arg)) {
        return node.get(arg);
      } else {
        const result = func(...args);
        node.set(arg, result);
        return result;
      }
    };
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
}

declare global {
  interface ProxyConstructor {
    new <TSource extends object, TTarget extends object>(
      target: TSource,
      handler: ProxyHandler<TSource>
    ): TTarget;
  }
}
