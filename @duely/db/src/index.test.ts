import { serviceAccountContextPromise } from '.';

test('serviceAccountContextPromise', async () => {
  const context = await serviceAccountContextPromise; 
  expect(context.jwt).toBeTruthy();
});
