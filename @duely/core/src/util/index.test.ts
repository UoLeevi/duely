import { Util } from '.';

test('Util.memo', () => {
  // upper case currency code
  const createObject = Util.memo((...args: any[]) => new Object());
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

