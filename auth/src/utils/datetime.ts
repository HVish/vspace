export enum DateTimeUnit {
  SECOND,
  MINUTE,
  HOUR,
  DAY,
}

function toUnixTime(date: number | Date) {
  return typeof date === 'number' ? date : date.getTime();
}

function getMultiplier(unit: DateTimeUnit) {
  const multipliers = [];
  switch (unit) {
    case DateTimeUnit.DAY:
      multipliers.push(24);
    // eslint-disable-next-line no-fallthrough
    case DateTimeUnit.HOUR:
      multipliers.push(60);
    // eslint-disable-next-line no-fallthrough
    case DateTimeUnit.MINUTE:
      multipliers.push(60);
    // eslint-disable-next-line no-fallthrough
    case DateTimeUnit.SECOND:
      multipliers.push(1000);
  }
  return multipliers.reduce((result, multiplier) => result * multiplier, 1);
}

function add(date: number | Date, amount: number, unit: DateTimeUnit) {
  const d = toUnixTime(date);
  const factor = getMultiplier(unit);
  return d + amount * factor;
}

export const DateTime = {
  toUnixTime,
  add,
};
