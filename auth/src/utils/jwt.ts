import { promisify } from 'util';
import jwt, {
  VerifyOptions,
  SignOptions,
  TokenExpiredError,
} from 'jsonwebtoken';
import { DateTime, DateTimeUnit } from './datetime';

// eslint-disable-next-line @typescript-eslint/ban-types
type SignPayload = string | Buffer | object;

export interface PrivateKey {
  key: string;
  passphrase: string;
}

const sign = (payload: SignPayload, privateKey?: PrivateKey) => {
  const secret = privateKey || process.env.JWT_SECRET;
  const options: SignOptions = { algorithm: privateKey ? 'RS256' : 'HS256' };
  return promisify(jwt.sign.bind(null, payload, secret, options))();
};

const verify = (token: string, publicKey?: string) => {
  const secret = publicKey || process.env.JWT_SECRET;
  const options: VerifyOptions = {
    algorithms: publicKey ? ['RS256'] : ['HS256'],
  };
  return promisify(jwt.verify.bind(null, token, secret, options))();
};

export interface JWTPayload {
  clientId?: string;
  expiresAt: UnixTime;
  issuedAt: UnixTime;
  userId: string;
}

export class InvalidJWTParamsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidJWTParams';
  }
}

export const JWT = Object.freeze({
  async create(
    extras: Optional<JWTPayload, 'expiresAt' | 'issuedAt'>,
    privateKey?: PrivateKey
  ) {
    const now = Date.now();

    const payload: JWTPayload = {
      expiresAt: DateTime.add(now, 2, DateTimeUnit.HOUR),
      issuedAt: now,
      ...extras,
    };

    if (!payload.userId) throw new InvalidJWTParamsError('userId is required!');

    const token = await sign(payload, privateKey);

    return {
      expiresAt: payload.expiresAt,
      token: token as string,
    };
  },

  async validate(token: string, publicKey?: string) {
    const payload = (await verify(token, publicKey)) as JWTPayload;

    if (payload.expiresAt < Date.now()) {
      throw new TokenExpiredError(
        'JWT token is expired.',
        new Date(payload.expiresAt)
      );
    }

    return payload;
  },
});
