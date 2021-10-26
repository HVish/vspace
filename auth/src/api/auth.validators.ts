import Joi from 'joi';
import { GrantType } from '../models/Client';

export const LaunchValidator = (joi: Joi.Root) => ({
  query: joi.object({
    clientId: joi.string().required(),
    redirectURI: joi.string().uri({ scheme: 'https' }).required(),
    state: joi.string().required(),
    grantType: joi.string().valid(...Object.values(GrantType)).required(),
  }),
});
