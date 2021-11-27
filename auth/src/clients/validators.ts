import { joi } from '@vspace/core';
import { GrantType } from './ClientModel';

export const ClientValidator = (joi: joi.Root) => ({
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
