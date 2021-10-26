import { AES } from './aes';

describe('AES encryption and descryption', () => {
  const plainText = 'random string :@134!#';
  const cipherText = AES.encrypt(plainText);
  const decipherText = AES.decrypt(cipherText);

  test('it should produce same string after encryption then decryption', () => {
    expect(cipherText).not.toEqual(plainText);
    expect(decipherText).toBe(plainText);
  });

  test('encrypted text should have exactly one "." character', () => {
    const components = cipherText.split('.');
    expect(components.length).toBe(2);
  });
});
