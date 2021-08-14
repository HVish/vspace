declare namespace NodeJS {
  export interface ProcessEnv {
    /** server port */
    PORT: string;
    /** mongodb connection URI */
    MONGO_DB_URI: string;
  }
}
