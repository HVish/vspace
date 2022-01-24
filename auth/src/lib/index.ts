import { JWT } from '../utils/jwt';

export function validateAccessToken(token: string, publicKey: string) {
  return JWT.validate(token, publicKey);
}
