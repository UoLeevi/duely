export type Override<T1, T2> = T2 & Omit<T1, keyof T2>;
export type FilterKeys<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T];

export type NotFunction<T> = T extends Function ? never : T;
export type GenericFunction<R = any, TArgs extends readonly any[] = any[]> = (...args: TArgs) => R;
export type ResolvableValue<R = any, TArgs extends readonly any[] = any[]> =
  | NotFunction<R | PromiseLike<R>>
  | GenericFunction<R | PromiseLike<R>, TArgs>;

export type ResolvedType<T> = T extends ResolvableValue<infer U, unknown[]> ? U : never;
export type ElementType<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;

export type Head<T extends readonly unknown[]> = T extends []
  ? []
  : T extends readonly [infer U, ...unknown[]]
  ? U
  : T extends unknown[]
  ? ElementType<T> | never
  : never;

export type Tail<T extends readonly unknown[]> = T extends [] | [unknown]
  ? []
  : T extends readonly [unknown, ...infer U]
  ? U
  : T extends unknown[]
  ? T
  : never;

export type Concat<
  T extends readonly unknown[],
  U extends readonly unknown[]
> = number extends Length<U>
  ? (ElementType<T> | ElementType<U>)[]
  : U extends []
  ? T
  : Concat<[...T, Head<U>], Tail<U>>;

export type First<T extends readonly unknown[]> = Head<T>;

export type Last<T extends readonly unknown[]> = T extends []
  ? never
  : T extends readonly [...unknown[], infer U]
  ? U
  : T extends unknown[]
  ? ElementType<T> | never
  : never;

export type Length<T extends readonly unknown[]> = number & T['length'];
export type LengthMinusOne<T extends readonly unknown[]> = Length<Tail<T>>;
export type LengthPlusOne<T extends readonly unknown[]> = Length<[unknown, ...T]>;

type _IndexOf<T extends readonly unknown[], E, A extends readonly unknown[]> = Last<A> extends E
  ? LengthMinusOne<A>
  : E extends Last<A>
  ? (number & keyof T) | -1
  : Length<A> extends Length<T>
  ? never
  : _IndexOf<T, E, Take<T, LengthPlusOne<A>>>;
export type IndexOf<T extends readonly unknown[], E> = _IndexOf<T, E, [Head<T>]>;

export type Reverse<T extends readonly unknown[]> = T extends []
  ? T
  : [Last<T>, ...Reverse<ExcludeLast<T>>];

export type ExcludeLast<T extends readonly unknown[]> = T extends []
  ? []
  : T extends readonly [...infer U, unknown]
  ? U
  : never;

export type Take<T extends readonly unknown[], I extends number & keyof T> = T extends []
  ? []
  : number extends I
  ? T
  : I extends Length<T>
  ? T
  : Take<ExcludeLast<T>, I>;

type _Skip<
  T extends readonly unknown[],
  I extends number & keyof T,
  A extends readonly unknown[]
> = number extends I ? T : I extends Length<T> ? A : _Skip<ExcludeLast<T>, I, [Last<T>, ...A]>;
export type Skip<T extends readonly unknown[], I extends number & keyof T> = _Skip<T, I, []>;

export type ExcludeIndex<
  T extends readonly unknown[],
  I extends number & keyof T
> = number extends I ? T : Concat<Take<T, I>, Tail<Skip<T, I>>>;

export type LeadingTypes<T extends readonly unknown[]> = T extends []
  ? T
  : T | LeadingTypes<ExcludeLast<T>>;

export type TrailingTypes<T extends readonly unknown[]> = T extends []
  ? T
  : T | TrailingTypes<Tail<T>>;

export type PartialApplication<
  T extends readonly unknown[],
  TPartials extends LeadingTypes<T>
> = TPartials extends []
  ? T
  : Head<TPartials> extends Head<T>
  ? Tail<TPartials> extends LeadingTypes<Tail<T>>
    ? PartialApplication<Tail<T>, Tail<TPartials>>
    : never
  : never;

export type PathValue<T, TPath extends readonly string[]> = TPath extends []
  ? T
  : Head<TPath> extends keyof T
  ? Tail<TPath> extends readonly string[]
    ? PathValue<T[Head<TPath>], Tail<TPath>>
    : never
  : never;

export type SplitString<
  TString extends string,
  TSep extends string
> = TString extends `${infer THead}${TSep}${infer TTail}`
  ? [THead, ...SplitString<TTail, TSep>]
  : [TString];
