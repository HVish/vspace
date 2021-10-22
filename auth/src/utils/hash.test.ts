import { Hash } from './hash';

describe('Text Hashing', () => {
  const plainText = 'this is a plain text';

  test('plain text should not match with hashed text', async () => {
    const hash = await Hash.create(plainText);
    expect(hash).not.toEqual(plainText);
  });

  test('two hashes generated from same plain-text should not match', async () => {
    const hash1 = await Hash.create(plainText);
    const hash2 = await Hash.create(plainText);
    expect(hash1).not.toEqual(hash2);
  });

  test('compareToHash() should resolve to true', async () => {
    const hash1 = await Hash.create(plainText);
    const hash2 = await Hash.create(plainText);
    expect(Hash.compare(plainText, hash1)).resolves.toBe(true);
    expect(Hash.compare(plainText, hash2)).resolves.toBe(true);
  });

  test('compareToHash() should resolve to false', () => {
    const result = Hash.compare(plainText, 'some other text');
    expect(result).resolves.toBe(false);
  });
});
