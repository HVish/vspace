import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { middlewares } from '@vspace/core';

import { BaseUser } from './UserModel';
import { LoginBody, LoginValidator, SignupValidator } from './validators';
import { UserController } from './UserController';

const userRoutes = Router();

userRoutes.post(
  '/users/v1',
  middlewares.validate(SignupValidator),
  async (req, res, next) => {
    try {
      const result = await UserController.signup(req.body as BaseUser);
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }
);

userRoutes.post(
  '/users/v1/login',
  middlewares.validate(LoginValidator),
  async (req, res, next) => {
    try {
      const result = await UserController.login(req.body as LoginBody);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default userRoutes;
