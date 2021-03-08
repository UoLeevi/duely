import { createLambdaUrl } from '.';

test('createLambdaUrl', () => {
  expect(createLambdaUrl('job-type/job-name', 'arg1', '{ "arg2": 123 }').toString()).toBe(
    'http://duely-lambda-service:8080/run/job-type%2Fjob-name/arg1/%7B%20%22arg2%22%3A%20123%20%7D'
  );
});
