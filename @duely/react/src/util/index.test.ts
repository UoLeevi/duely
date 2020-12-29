import { Util } from '.';

// Util.get
test('can access nested object', () => {
  expect(
    Util.get(
      {
        test: 5
      },
      'test'
    )
  ).toBe(5);

  expect(
    Util.get(
      {
        agency: {
          name: 'Test agency'
        }
      },
      'agency.name'
    )
  ).toBe('Test agency');
});

// Util.template
test('can compile basic templates', () => {
  expect(
    Util.template(
      `
      # Some heading

      Welcome to **{agency.name}**
      `,
      {
        agency: {
          name: 'Test agency'
        }
      }
    )
  ).toBe(
    `
      # Some heading

      Welcome to **Test agency**
      `
  );
});
