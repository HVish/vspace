import jwt from 'jsonwebtoken';
import { DateTime, DateTimeUnit } from './datetime';

type CreateJWTPayload = Record<string, string | number | undefined>;

interface CreateJWTResult {
  expiresAt: UnixTime;
  token: string;
}

async function create<T extends CreateJWTPayload>(extras: T | undefined) {
  return new Promise<CreateJWTResult>((resolve, reject) => {
    const now = Date.now();

    const payload = {
      expiresAt: DateTime.add(now, 2, DateTimeUnit.HOUR),
      issuedAt: now,
      ...extras,
    };

    const handleResult = (err: Error | null, token: string | undefined) => {
      if (err) return reject(err);
      resolve({
        expiresAt: payload.expiresAt,
        token: token as string,
      });
    };

    jwt.sign(payload, process.env.JWT_SECRET, handleResult);
  });
}

export const JWT = Object.freeze({
  create,
});
