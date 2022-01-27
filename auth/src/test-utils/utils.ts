/**
 * Finds name of a function
 * This code is copied from [here](https://github.com/facebook/jest/blob/7bb400c373a6f90ba956dd25fe24ee4d4788f41e/packages/expect/src/jasmineUtils.ts#L223-L232)
 * @param func any function
 * @returns name of function
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function fnNameFor(func: Function) {
  if (func.name) {
    return func.name;
  }

  const matches = Function.prototype.toString
    .call(func)
    .match(/^(?:async)?\s*function\s*\*?\s*([\w$]+)\s*\(/);
  return matches ? matches[1] : '<anonymous>';
}
