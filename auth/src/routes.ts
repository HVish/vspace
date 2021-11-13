import { Router } from 'express';
import clientRoutes from './clients/routes';
import userRoutes from './users/routes';

const routes = Router();

routes.use(userRoutes);
routes.use(clientRoutes);

export default routes;
