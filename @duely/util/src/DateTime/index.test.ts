import { dateToTimestamp, timestampToDate } from '.';

test('timestamps', () => {
  const date = new Date();
  expect(dateToTimestamp(date)).toBe(dateToTimestamp(timestampToDate(dateToTimestamp(date))));
});
