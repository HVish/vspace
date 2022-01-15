import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import helmet from 'helmet';
import routes from './routes';
import { ServerError } from './utils/error';

function server(): Express {
  const app = express();

  // middlewares
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // app routes
  app.use(routes);

  app.get('/ping', (_req, res) => {
    res.send('pong');
  });

  app.use(
    (
      err: ServerError | Error,
      _req: Request,
      res: Response,
      next: NextFunction
    ) => {
      if ((err as ServerError).isKnownError) {
        const error = err as ServerError;
        res.status(error.code).json({
          ...error.extras,
          message: error.message,
        });
      } else {
        console.error(err);
        next(err);
      }
    }
  );

  return app;
}

export default server();
