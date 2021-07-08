import { getServiceAccountContext } from '.';

test('getServiceAccountContext', async () => {
  const context = await getServiceAccountContext(); 
  expect(context.jwt).toBeTruthy();
});
