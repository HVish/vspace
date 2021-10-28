import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { middlewares } from '@vspace/core';

import { BaseUser } from './UserModel';
import { SignupValidator } from './validators';
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

export default userRoutes;
