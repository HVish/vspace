import { StatusCodes } from 'http-status-codes';
import { ServerErrorFactory } from '../utils/error';

export const UsernameExistsError = ServerErrorFactory({
  name: 'UsernameExistsError',
  defaultCode: StatusCodes.PRECONDITION_FAILED,
  defaultmessage: 'This username already exists.',
});
