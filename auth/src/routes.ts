import { Router } from 'express';

const routes = Router();

routes.get('/auth/login', async (req, res) => {
  res.json({ message: 'ok' });
});

export default routes;
