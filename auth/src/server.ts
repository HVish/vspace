import express, { Express } from 'express';
import helmet from 'helmet';
import routes from './routes';

function server(): Express {
  const app = express();

  // middlewares
  app.use(helmet());
  app.use(routes);

  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  return app;
}

export default server();
