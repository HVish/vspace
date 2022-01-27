import { AsymmetricMatcher } from './types';
import { fnNameFor } from './utils';
/**
 * This class has been created with following reference:
 * @see https://github.com/facebook/jest/blob/main/packages/expect/src/asymmetricMatchers.ts#L48-L122
 */
export class NullOrAny implements AsymmetricMatcher {
  $$typeof = Symbol.for('jest.asymmetricMatcher');

  constructor(private sample: unknown) {
    if (typeof sample === 'undefined') {
      throw new TypeError(
        'nullOrAny() expects to be passed a constructor function. ' +
          'Please pass one or use anything() to match any object.'
      );
    }
  }

  asymmetricMatch(other: unknown) {
    if (other == null) return true;

    if (this.sample == String) {
      return typeof other == 'string' || other instanceof String;
    }

    if (this.sample == Number) {
      return typeof other == 'number' || other instanceof Number;
    }

    if (this.sample == Function) {
      return typeof other == 'function' || other instanceof Function;
    }

    if (this.sample == Boolean) {
      return typeof other == 'boolean' || other instanceof Boolean;
    }

    if (this.sample == BigInt) {
      return typeof other == 'bigint' || other instanceof BigInt;
    }

    if (this.sample == Symbol) {
      return typeof other == 'symbol' || other instanceof Symbol;
    }

    if (this.sample == Object) {
      return typeof other == 'object';
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return other instanceof this.sample;
  }

  toString() {
    return 'NullOrAny';
  }

  getExpectedType() {
    if (this.sample == String) {
      return 'string';
    }

    if (this.sample == Number) {
      return 'number';
    }

    if (this.sample == Function) {
      return 'function';
    }

    if (this.sample == Object) {
      return 'object';
    }

    if (this.sample == Boolean) {
      return 'boolean';
    }

    return fnNameFor(this.sample as never);
  }

  toAsymmetricMatcher() {
    return 'NullOrAny<' + fnNameFor(this.sample as never) + '>';
  }
}

expect.nullOrAny = (expectedObject: unknown): NullOrAny => new NullOrAny(expectedObject);
