import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import {
  UnSupportedAuthSchemeError,
  AuthTokenExpiredError,
  AuthTokenNotProvidedError,
  MalformedAuthTokenError,
} from '../shared/errors';
import { JWT } from '../utils/jwt';

export enum AuthStrategy {
  BEARER = 'Bearer',
}

async function authenticate<P, ResBody, ReqBody, ReqQuery, Locals>(
  req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
  _res: Response<ResBody, Locals>,
  next: NextFunction
) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');

  if (!token) {
    return next(new AuthTokenNotProvidedError());
  }

  if (scheme !== AuthStrategy.BEARER) {
    return next(new UnSupportedAuthSchemeError());
  }

  try {
    const { clientId, userId } = await JWT.validate(token);

    /**
     * inject user-id and client-id to request object
     * to be used in next handlers
     */
    req.userId = userId;
    req.clientId = clientId;

    // success proceed to next request handlers
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AuthTokenExpiredError());
    } else if (error instanceof JsonWebTokenError) {
      next(new MalformedAuthTokenError());
    } else {
      // unkown error
      next(error);
    }
  }
}

export default authenticate;
