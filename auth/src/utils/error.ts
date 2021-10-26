import { StatusCodes } from 'http-status-codes';

interface ErrorConfig {
  name: string;
  defaultCode: StatusCodes;
}

export function ServerErrorFactory({ name, defaultCode }: ErrorConfig) {
  return class AuthServerError extends Error {
    public readonly isKnownError = true;
    public code: StatusCodes;
    constructor(message: string, code?: StatusCodes) {
      super(message);
      this.name = name;
      this.message = message;
      this.code = code || defaultCode;
    }
  };
}
