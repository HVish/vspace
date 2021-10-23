declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | 'test';
    /** server port */
    PORT: string;
    /** mongodb connection URI */
    MONGO_DB_URI: string;
    /** AES encryption/decryption key */
    AES_KEY: string;
  }
}
