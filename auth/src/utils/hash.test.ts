import { Hash } from './hash';

describe('Text Hashing', () => {
  let hash1: string;
  let hash2: string;
  const plainText = 'this is a plain text';

  beforeAll(async () => {
    hash1 = await Hash.create(plainText);
    hash2 = await Hash.create(plainText);
  });

  test('plain text should not match with hashed text', async () => {
    expect(hash1).not.toEqual(plainText);
  });

  test('two hashes generated from same plain-text should not match', async () => {
    expect(hash1).not.toEqual(hash2);
  });

  test('compareToHash() should resolve to true', async () => {
    expect(Hash.compare(plainText, hash1)).resolves.toBe(true);
    expect(Hash.compare(plainText, hash2)).resolves.toBe(true);
  });

  test('compareToHash() should resolve to false', () => {
    const result = Hash.compare(plainText, 'some other text');
    expect(result).resolves.toBe(false);
  });
});
