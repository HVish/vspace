import bcrypt from 'bcrypt';

export const Hash = Object.freeze({
  /**
   * Creates hash from a plain text
   * @param text string to be hashed
   * @param saltFactor number of rotations to generate salt factor
   * @returns hashed string
   */
  async create(text: string, saltFactor = 10) {
    const salt = await bcrypt.genSalt(saltFactor);
    return bcrypt.hash(text, salt);
  },

  /**
   * Checks if hashed-text is generated from plain-text.
   * @param plainText readable text that need to be compared with hashedText
   * @param hashedText hashed-text to be matched
   * @returns true if matched else false
   */
  compare(plainText: string, hashedText: string) {
    return bcrypt.compare(plainText, hashedText);
  },
});
