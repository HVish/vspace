import Joi from 'joi';

export const launchValidator = (joi: Joi.Root) => ({
  query: joi.object({
    clientId: joi.string().required(),
    redirectURI: joi.string().uri({ scheme: 'https' }),
    state: joi.string().required(),
    response_type: joi.string().valid('code').required(),
  }),
});
