export interface AsymmetricMatcher {
  $$typeof: symbol;
  asymmetricMatch(other: unknown): boolean;
  toString(): string;
  getExpectedType(): string;
  toAsymmetricMatcher(): string;
}
