import { StatusCodes } from 'http-status-codes';
import { ServerErrorFactory } from '../utils/error';

export const UnSupportedGrantTypeError = ServerErrorFactory({
  name: 'UnSupportedGrantTypeError',
  defaultCode: StatusCodes.FORBIDDEN,
  defaultmessage: 'This grant type is not supported.',
});
