import { TokenExpiredError } from 'jsonwebtoken';
import { mockRSAKeyPair } from '../mocks/jwt';
import { DateTime, DateTimeUnit } from './datetime';
import { InvalidJWTParamsError, JWT } from './jwt';

describe('JWT', () => {
  test('JWT.create() should throw error when userId is empty', async () => {
    try {
      await JWT.create({ userId: '' });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidJWTParamsError);
    }
  });

  test('JWT.create() should create jwt with valid payload', async () => {
    const params = {
      userId: 'some-userid',
      clientId: 'some-clientid',
    };

    const results = await Promise.all([
      JWT.create(params),
      JWT.create(params, mockRSAKeyPair.privateKey),
    ]);

    results.forEach((result) => {
      expect(result).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          expiresAt: expect.any(Number),
        })
      );

      expect(result.expiresAt).toBeGreaterThan(
        DateTime.add(Date.now(), 1.5, DateTimeUnit.HOUR)
      );

      expect(result.expiresAt).toBeLessThanOrEqual(
        DateTime.add(Date.now(), 2, DateTimeUnit.HOUR)
      );
    });
  });

  test('JWT.validate() should throw token expired error', async () => {
    const params = {
      userId: 'some-userid',
      clientId: 'some-clientid',
      expiresAt: DateTime.add(Date.now(), -3, DateTimeUnit.HOUR),
    };

    const result = await JWT.create(params);

    try {
      await JWT.validate(result.token);
    } catch (error) {
      expect(error).toBeInstanceOf(TokenExpiredError);
    }
  });

  test('JWT.validate() should validate a valid jwt token', async () => {
    const params = {
      userId: 'some-userid',
      clientId: 'some-clientid',
    };

    const result = await JWT.create(params);
    const decoded = await JWT.validate(result.token);

    expect(decoded.userId).toBe(params.userId);
    expect(decoded.clientId).toBe(params.clientId);
  });

  test('JWT.validate() should validate a valid jwt token using RSA key-pair', async () => {
    const params = {
      userId: 'some-userid',
      clientId: 'some-clientid',
    };

    const result = await JWT.create(params, mockRSAKeyPair.privateKey);
    const decoded = await JWT.validate(result.token, mockRSAKeyPair.publicKey);

    expect(decoded.userId).toBe(params.userId);
    expect(decoded.clientId).toBe(params.clientId);
  });
});
