import { StatusCodes } from 'http-status-codes';
import { ServerErrorFactory } from '../utils/error';

export const InvalidCredentialsError = ServerErrorFactory({
  name: 'InvalidCredentialsError',
  defaultCode: StatusCodes.UNAUTHORIZED,
  defaultmessage: 'Invalid credentials provided.',
});

export const AuthTokenNotProvidedError = ServerErrorFactory({
  name: 'AuthTokenNotProvidedError',
  defaultCode: StatusCodes.FORBIDDEN,
  defaultmessage: 'Auth token is missing.',
});

export const UnSupportedAuthStrategyError = ServerErrorFactory({
  name: 'UnSupportedAuthStrategyError',
  defaultCode: StatusCodes.FORBIDDEN,
  defaultmessage: 'This authorization strategy is not supported.',
});

export const AuthTokenExpiredError = ServerErrorFactory({
  name: 'AuthTokenExpiredError',
  defaultCode: StatusCodes.UNAUTHORIZED,
  defaultmessage: 'Auth token expired.',
});

export const MalformedAuthTokenError = ServerErrorFactory({
  name: 'MalformedAuthTokenError',
  defaultCode: StatusCodes.FORBIDDEN,
  defaultmessage: 'Malformed auth token is provided.',
});
