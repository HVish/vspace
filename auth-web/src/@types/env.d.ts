declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | 'test';
    REACT_APP_BASE_URL: string;
  }
}
