import { StatusCodes } from 'http-status-codes';
import { ServerErrorFactory } from './error';

describe('ServerErrorFactory', () => {
  const defaultmessage = 'default message';
  const TestError = ServerErrorFactory({
    name: 'TestError',
    defaultCode: StatusCodes.FORBIDDEN,
    defaultmessage,
  });

  test('should create an error class', () => {
    const error = new TestError();
    expect(error).toBeInstanceOf(TestError);
    expect(error.isKnownError).toBe(true);
    expect(error.message).toBe(defaultmessage);
    expect(error.code).toBe(StatusCodes.FORBIDDEN);
  });

  test('should override default code', () => {
    const error = new TestError({ code: StatusCodes.NOT_FOUND });
    expect(error.code).toBe(StatusCodes.NOT_FOUND);
  });

  test('should override default message', () => {
    const message = 'test error message';
    const error = new TestError({ message });
    expect(error.message).toBe(message);
  });
});
