import { DateTime, DateTimeUnit } from './datetime';

describe('DateTime', () => {
  test('toUnixTime() should convert date object to unix-timestamp', () => {
    const date = new Date();
    const timestamp = DateTime.toUnixTime(date);
    expect(typeof timestamp).toBe('number');
    expect(timestamp).toStrictEqual(date.getTime());
  });
  test('add() should add time to specified unit', () => {
    const date = new Date();
    expect(DateTime.add(date, 3, DateTimeUnit.SECOND)).toBe(
      date.getTime() + 3 * 1000
    );
    expect(DateTime.add(date, 10, DateTimeUnit.MINUTE)).toBe(
      date.getTime() + 10 * 60 * 1000
    );
    expect(DateTime.add(date, -13, DateTimeUnit.MINUTE)).toBe(
      date.getTime() - 13 * 60 * 1000
    );
    expect(DateTime.add(date, 2, DateTimeUnit.HOUR)).toBe(
      date.getTime() + 2 * 60 * 60 * 1000
    );
    expect(DateTime.add(date, 5, DateTimeUnit.DAY)).toBe(
      date.getTime() + 5 * 24 * 60 * 60 * 1000
    );
  });
});
