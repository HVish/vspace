import { Request, Response } from 'express';
import {
  AuthTokenExpiredError,
  AuthTokenNotProvidedError,
  MalformedAuthTokenError,
  UnSupportedAuthStrategyError,
} from '../shared/errors';
import { DateTime, DateTimeUnit } from '../utils/datetime';
import { JWT } from '../utils/jwt';
import authenticate from './authenticate';

const createMockRequest = (authorization?: string) =>
  ({ headers: { authorization } } as Request);

describe('authenticate() middleware', () => {
  let validJWT: string;
  let expiredJWT: string;

  beforeAll(async () => {
    const userId = 'test-userid';
    const [result1, result2] = await Promise.all([
      JWT.create({
        userId: 'test-userid',
      }),
      JWT.create({
        userId,
        expiresAt: DateTime.add(Date.now(), -3, DateTimeUnit.HOUR),
      }),
    ]);
    validJWT = result1.token;
    expiredJWT = result2.token;
  });

  test('should call next with AuthTokenNotProvidedError', async () => {
    const next = jest.fn();
    const request = createMockRequest();
    await authenticate(request, {} as Response, next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(AuthTokenNotProvidedError);
  });

  test('should call next with UnSupportedAuthStrategyError', async () => {
    const next = jest.fn();
    const request = createMockRequest(`Strategy ${validJWT}`);
    await authenticate(request, {} as Response, next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(UnSupportedAuthStrategyError);
  });

  test('should call next with MalformedAuthTokenError', async () => {
    const next = jest.fn();
    const request = createMockRequest(`Bearer malformed.jwt.token`);
    await authenticate(request, {} as Response, next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(MalformedAuthTokenError);
  });

  test('should call next with AuthTokenExpiredError', async () => {
    const next = jest.fn();
    const request = createMockRequest(`Bearer ${expiredJWT}`);
    await authenticate(request, {} as Response, next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(AuthTokenExpiredError);
  });

  test('should call next with empty arguments', async () => {
    const next = jest.fn();
    const request = createMockRequest(`Bearer ${validJWT}`);
    await authenticate(request, {} as Response, next);
    expect(next).toHaveBeenCalledWith();
  });
});
