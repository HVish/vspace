import Joi from 'joi';
import { GrantType } from './ClientModel';

export const ClientValidator = (joi: Joi.Root) => ({
  body: joi.object({
    clientId: joi.string().required(),
    redirectURI: joi.string().uri({ scheme: 'https' }).required(),
    state: joi.string().required(),
    grantType: joi
      .string()
      .valid(...Object.values(GrantType))
      .required(),
  }),
});
