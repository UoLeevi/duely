import { lazy, memo } from '.';

test('memo', () => {
  const createObject = memo((...args: any[]) => new Object());
  expect(createObject()).toBe(createObject());
  expect(createObject(1)).toBe(createObject(1));
  expect(createObject(1, 2)).toBe(createObject(1, 2));
  expect(createObject(1, 2, 3)).toBe(createObject(1, 2, 3));
  expect(createObject('test', 'asdf')).toBe(createObject('test', 'asdf'));

  expect(createObject()).not.toBe(createObject(undefined));
  expect(createObject(undefined, undefined)).not.toBe(createObject(undefined));
  expect(createObject('test', 'asdf')).not.toBe(createObject('test', 'qwer'));

  const arg0 = new Object();
  const arg1 = new Object();
  expect(createObject(arg0, arg1)).toBe(createObject(arg0, arg1));
  expect(createObject(arg0)).not.toBe(createObject(arg1));
});

test('lazy', async () => {
  let i = 0;
  const lazyObject = lazy(() => {
    ++i;
    return {
      i
    };
  });

  expect(i).toBe(0);
  expect(lazyObject.i).toBe(1);
  expect(i).toBe(1);
  lazyObject.i = 2;
  expect(i).toBe(1);
  expect(lazyObject.i).toBe(2);

  const obj = {};
  const fetchObject = lazy(() => new Promise((resolve) => setTimeout(() => resolve(obj), 1)));
  expect(await fetchObject).toBe(obj);
});
