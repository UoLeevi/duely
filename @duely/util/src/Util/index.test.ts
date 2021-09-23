import { get, lazy, memo } from '.';

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

test('get', () => {
  const obj = {
    a: 1,
    b: {
      ba: { baa: 2 },
      bb: 3
    },
    c: {
      ca: {
        caa: 4
      }
    }
  } as const;

  const a = get(obj, 'a');
  expect(a).toBe(obj['a']);

  const ba = get(obj, 'b.ba');
  expect(ba).toBe(obj['b']['ba']);

  const bb = get(obj, 'b.bb');
  expect(bb).toBe(obj['b']['bb']);

  const caa = get(obj, 'c.ca.caa');
  expect(caa).toBe(obj['c']['ca']['caa']);
});
