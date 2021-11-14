import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { DateTime, DateTimeUnit } from './datetime';

export interface JWTPayload {
  clientId?: string;
  expiresAt: UnixTime;
  issuedAt: UnixTime;
  userId: string;
}

interface CreateJWTResult {
  expiresAt: UnixTime;
  token: string;
}

export class InvalidJWTParamsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidJWTParams';
  }
}

export const JWT = Object.freeze({
  async create(extras: Optional<JWTPayload, 'expiresAt' | 'issuedAt'>) {
    return new Promise<CreateJWTResult>((resolve, reject) => {
      const now = Date.now();

      const payload: JWTPayload = {
        expiresAt: DateTime.add(now, 2, DateTimeUnit.HOUR),
        issuedAt: now,
        ...extras,
      };

      if (!payload.userId) {
        return reject(new InvalidJWTParamsError('userId is required!'));
      }

      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) return reject(err);
        resolve({
          expiresAt: payload.expiresAt,
          token: token as string,
        });
      });
    });
  },

  async validate(token: string) {
    return new Promise<JWTPayload>((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
        if (err) {
          return reject(err);
        }

        const payload = result as JWTPayload;

        if (payload.expiresAt < Date.now()) {
          throw new TokenExpiredError(
            'JWT token is expired.',
            new Date(payload.expiresAt)
          );
        }

        resolve(payload);
      });
    });
  },
});
