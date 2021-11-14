import { middlewares } from '@vspace/core';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ClientController, LaunchData } from './ClientController';
import { ClientValidator } from './validators';

const clientRoutes = Router();

clientRoutes.post(
  '/clients/verify',
  middlewares.validate(ClientValidator),
  async (req, res, next) => {
    try {
      await ClientController.verifyLaunch(req.body as unknown as LaunchData);
      res.status(StatusCodes.OK).json({ valid: true });
    } catch (error) {
      next(error);
    }
  }
);

export default clientRoutes;
