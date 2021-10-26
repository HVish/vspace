import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const AES_KEY = process.env.AES_KEY;

export const AES = Object.freeze({
  /**
   * Encrypts a plain-text using AES encryption
   * @param text plain-text to be encrypted
   * @param ivLen initialization vector length, optional
   * @returns encrypted text
   */
  encrypt(text: string, ivLen = 16) {
    const iv = randomBytes(ivLen);

    const cipher = createCipheriv('aes-256-cbc', Buffer.from(AES_KEY), iv);
    const cipherText = Buffer.concat([cipher.update(text), cipher.final()]);

    // join iv and cipherText with "." separator
    return [iv, cipherText].map((text) => text.toString('base64')).join('.');
  },
  /**
   * Decrypts an AES encrypted-text
   * @param text AES encrypted text with a "." delimited initialization vector prefix
   * @returns plain-text
   */
  decrypt(text: string) {
    const [iv, cipherText] = text
      .split('.')
      .map((text) => Buffer.from(text, 'base64'));

    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(AES_KEY), iv);

    const decipherText = Buffer.concat([
      decipher.update(cipherText),
      decipher.final(),
    ]);

    return decipherText.toString();
  },
});
