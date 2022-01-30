import { middlewares } from '@vspace/core';
import { ErrorBody } from '@vspace/core/dist/middlewares';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import authenticate from '../middlewares/authenticate';
import { AuthroizeResponse, ClientController } from './ClientController';
import { ClientWithoutSecret } from './ClientModel';
import {
  CreateClientRequest,
  CreateClientValidator,
  CreateTokenRequest,
  CreateTokenValidator,
  LaunchRequest,
  LaunchValidator,
} from './validators';

const clientRoutes = Router();

clientRoutes.post<never, ErrorBody | ClientWithoutSecret, CreateClientRequest>(
  '/clients/v1',
  authenticate,
  middlewares.validate(CreateClientValidator),
  async (req, res, next) => {
    try {
      const adminId = req.userId || '';
      const client = await ClientController.create({ ...req.body, adminId });
      res.status(StatusCodes.CREATED).json(client);
    } catch (error) {
      next(error);
    }
  }
);

interface VerifyClientResponse {
  valid: boolean;
}

clientRoutes.post<never, ErrorBody | VerifyClientResponse, LaunchRequest>(
  '/clients/v1/verify',
  middlewares.validate(LaunchValidator),
  async (req, res, next) => {
    try {
      await ClientController.verifyLaunch(req.body);
      res.status(StatusCodes.OK).json({ valid: true });
    } catch (error) {
      next(error);
    }
  }
);

clientRoutes.post<never, ErrorBody | AuthroizeResponse, CreateTokenRequest>(
  '/clients/v1/authorize',
  authenticate,
  middlewares.validate(CreateTokenValidator),
  async (req, res, next) => {
    try {
      const result = await ClientController.authorize(req.body);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default clientRoutes;
