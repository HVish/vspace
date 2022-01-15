import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { middlewares } from '@vspace/core';

import { BaseUserWithoutId } from './UserModel';
import {
  GetAuthCodeQuery,
  GetAuthCodeValidator,
  LoginBody,
  LoginValidator,
  SignupValidator,
} from './validators';
import { AuthResponse, UserController } from './UserController';
import authenticate from '../middlewares/authenticate';
import { ErrorBody } from '@vspace/core/dist/middlewares';

const userRoutes = Router();

userRoutes.post<never, ErrorBody | AuthResponse, BaseUserWithoutId>(
  '/users/v1',
  middlewares.validate(SignupValidator),
  async (req, res, next) => {
    try {
      const result = await UserController.signup(req.body);
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.post<never, ErrorBody | AuthResponse, LoginBody>(
  '/users/v1/login',
  middlewares.validate(LoginValidator),
  async (req, res, next) => {
    try {
      const result = await UserController.login(req.body);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
);

interface GetAuthCodeResponse {
  authCode: string;
}

userRoutes.get<never, ErrorBody | GetAuthCodeResponse, never, GetAuthCodeQuery>(
  '/users/v1/auth-code',
  authenticate,
  middlewares.validate(GetAuthCodeValidator),
  async (req, res, next) => {
    try {
      const userId = req.userId || '';
      const { clientId } = req.query;
      const authCode = await UserController.getAuthCode(userId, clientId);
      res.status(StatusCodes.OK).json({ authCode });
    } catch (error) {
      next(error);
    }
  }
);

export default userRoutes;
