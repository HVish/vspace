declare global {
  namespace jest {
    interface Expect {
      /**
       * Matches anything that was created with the given constructor or null.
       * You can use it inside `toEqual` or `toBeCalledWith` instead of a literal value.
       *
       * @param classType class constructor
       *
       * @example
       *
       * function randomcall(fn) {
       *   return fn(Math.floor(Math.random() * 6 + 1));
       * }
       *
       * test('randomcall calls its callback with a number', () => {
       *   const mock = jest.fn();
       *   randomcall(mock);
       *   expect(mock).toBeCalledWith(expect.nullOrAny(Number));
       * });
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nullOrAny(classType: any): any;
    }
  }
}

export {};
