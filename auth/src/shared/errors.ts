import { StatusCodes } from 'http-status-codes';
import { ServerErrorFactory } from '../utils/error';

export const InvalidCredentialsError = ServerErrorFactory({
  name: 'InvalidCredentialsError',
  defaultCode: StatusCodes.UNAUTHORIZED,
  defaultmessage: 'Invalid credentials provided.',
});
