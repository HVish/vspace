import { StatusCodes } from 'http-status-codes';
import { ServerErrorFactory } from './error';

describe('ServerErrorFactory', () => {
  const TestError = ServerErrorFactory({
    name: 'TestError',
    defaultCode: StatusCodes.FORBIDDEN,
  });

  test('should create an error class', () => {
    const error = new TestError('test error message');
    expect(error).toBeInstanceOf(TestError);
    expect(error.isKnownError).toBe(true);
    expect(error.code).toBe(StatusCodes.FORBIDDEN);
  });

  test('should override default code', () => {
    const error = new TestError('test error message', StatusCodes.NOT_FOUND);
    expect(error.code).toBe(StatusCodes.NOT_FOUND);
  });
});
