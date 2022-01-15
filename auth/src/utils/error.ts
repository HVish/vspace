import { StatusCodes } from 'http-status-codes';

interface ErrorConfig {
  name: string;
  defaultCode: StatusCodes;
  defaultmessage: string;
}

export interface ErrorParams<T> {
  code?: StatusCodes;
  message?: string;
  extras?: T;
}

type Extras = Record<string, string | number | undefined>;

export interface ServerError {
  readonly isKnownError: boolean;
  code: StatusCodes;
  message: string;
  extras?: Extras;
}

export function ServerErrorFactory({
  name,
  defaultCode,
  defaultmessage,
}: ErrorConfig) {
  return class AuthServerError<T extends Extras = never>
    extends Error
    implements ServerError
  {
    public readonly isKnownError = true;

    public code: StatusCodes;
    public extras?: T;

    constructor(params?: ErrorParams<T>) {
      super(params?.message || defaultmessage);

      this.name = name;

      const { code, message, extras } = {
        code: defaultCode,
        message: defaultmessage,
        extras: undefined,
        ...params,
      };

      this.message = message;
      this.code = code;
      this.extras = extras;
    }
  };
}
