import { StatusCodes } from 'http-status-codes';
import { ServerErrorFactory } from '../utils/error';

export const InvalidCredentials = ServerErrorFactory({
  name: 'InvalidCredentials',
  defaultCode: StatusCodes.UNAUTHORIZED,
  defaultmessage: 'Invalid credentials provided!',
});
