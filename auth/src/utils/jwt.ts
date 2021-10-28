import jwt from 'jsonwebtoken';
import { DateTime, DateTimeUnit } from './datetime';

async function create<T extends Record<string, string | number | undefined>>(
  extras: T | undefined
) {
  return new Promise<string | undefined>((resolve, reject) => {
    const now = Date.now();
    jwt.sign(
      {
        issuedAt: now,
        expiresAt: DateTime.add(now, 2, DateTimeUnit.HOUR),
        ...extras,
      },
      process.env.JWT_SECRET,
      (err: Error | null, token: string | undefined) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
}

export const JWT = Object.freeze({
  create,
});
