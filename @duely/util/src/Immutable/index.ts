import { Concat, ElementType, ExcludeIndex, IndexOf, Length, Skip, Tail, Take } from '..';

export function push<A extends readonly unknown[], E>(array: A, element: E): [...A, E] {
  return [...array, element];
}

export function removeAt<A extends readonly unknown[], I extends number & keyof A>(
  array: A,
  index: I
): ExcludeIndex<A, I> {
  const before = array.slice(0, index);
  const after = array.slice(index + 1);
  return [...before, ...after] as any;
}

export function remove<A extends readonly unknown[]>(
  array: A,
  predicate: (element: ElementType<A>, index: number & keyof A) => boolean
): ElementType<A>[] {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (predicate(element as any, index)) {
      return removeAt(array, index) as any;
    }
  }

  return [...array] as any;
}

export function set<A extends readonly unknown[], I extends number & keyof A, E>(
  array: A,
  index: I,
  element: E
): number extends I ? (ElementType<A> | E)[] : Concat<Concat<Take<A, I>, [E]>, Tail<Skip<A, I>>> {
  const before = array.slice(0, index);
  const after = array.slice(index + 1);
  return [...before, element, ...after] as any;
}
