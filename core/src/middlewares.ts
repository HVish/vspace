import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi, { Schema } from 'joi';

interface RequestValidationSchemaMap {
  query?: Schema;
  body?: Schema;
}

export interface ErrorBody {
  errors: {
    query?: string;
    body?: string;
  };
}

export const validate = <P, ResBody, ReqBody, ReqQuery, Locals>(
  schemaFn: (joi: Joi.Root) => RequestValidationSchemaMap
): RequestHandler<P, ResBody | ErrorBody, ReqBody, ReqQuery, Locals> => {
  return (req, res, next) => {
    const schema = schemaFn(Joi);

    const result = {
      query: schema.query?.validate(req.query, { abortEarly: false }),
      body: schema.body?.validate(req.body, { abortEarly: false }),
    };

    let hasErrors = false;

    if (result.query?.error) {
      hasErrors = true;
      if (process.env.NODE_ENV === 'development') {
        console.log(result.query.error.annotate());
      }
    }

    if (result.body?.error) {
      hasErrors = true;
      if (process.env.NODE_ENV === 'development') {
        console.log(result.body.error.annotate());
      }
    }

    if (hasErrors) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        errors: {
          query: result.query?.error?.toString(),
          body: result.body?.error?.toString(),
        },
      });
    }

    next();
  };
};
