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
}
