export type NotFunction<T> = T extends Function ? never : T;
export type GenericFunction<R = any, TArgs extends any[] = any[]> = (...args: TArgs) => R;
export type ResolvableValue<R = any, TArgs extends any[] = any[]> =
  | NotFunction<R | PromiseLike<R>>
  | GenericFunction<R | PromiseLike<R>, TArgs>;

export type ResolvedType<T> = T extends ResolvableValue<infer U, unknown[]> ? U : never;
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type Head<T extends unknown[]> = T extends [infer U, ...unknown[]] ? U : never;
export type Tail<T extends unknown[]> = T extends [unknown, ...infer U] ? U : never;

export namespace Util {
  export function hasProperty<T, TKey extends PropertyKey>(
    obj: T,
    propertyName: TKey
  ): obj is T & Record<TKey, unknown> {
    return typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, propertyName);
  }

  export function isFunction<R = any, TArgs extends any[] = any[]>(
    value: NotFunction<R> | GenericFunction<R, TArgs>
  ): value is GenericFunction<R, TArgs> {
    return typeof value === 'function';
  }

  export async function resolve<R = any, TArgs extends any[] = any[]>(
    value: ResolvableValue<R, TArgs>,
    ...args: TArgs
  ): Promise<R> {
    return await (isFunction(value) ? value(...args) : value);
  }

  export function identity<T = any>(arg: T): T {
    return arg;
  }

  export function partial<R = any, TPartials extends any[] = any[], TRest extends any[] = any[]>(
    func: GenericFunction<R, [...TPartials, ...TRest]>,
    ...partials: TPartials
  ): GenericFunction<R, TRest> {
    return (...rest) => func(...partials, ...rest);
  }
}
