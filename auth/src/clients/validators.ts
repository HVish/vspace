import { joi } from '@vspace/core';
import { BaseClient, GrantType } from './ClientModel';

export type CreateClientRequest = Omit<BaseClient, 'adminId' | 'clientId'>;

export const CreateClientValidator = (joi: joi.Root) => ({
  body: joi.object<CreateClientRequest, true>({
    logo: joi.string().uri({ scheme: 'https' }).required(),
    name: joi.string().min(4).required(),
    redirectURIs: joi.array().items(joi.string().uri({ scheme: 'https' })),
    secret: joi.string().min(8).required(),
  }),
});

export interface LaunchRequest {
  clientId: string;
  redirectURI: string;
}

export const LaunchValidator = (joi: joi.Root) => ({
  body: joi.object<LaunchRequest, true>({
    clientId: joi.string().required(),
    redirectURI: joi.string().uri({ scheme: 'https' }).required(),
  }),
});

export interface ClientCredentials {
  clientId: string;
  redirectURI: string;
  secret: string;
}

export interface CreateTokenRequest extends ClientCredentials {
  grant: string;
  /**
   * Only `auth_code` supported
   */
  grantType: GrantType.AUTH_CODE;
}

export const CreateTokenValidator = (joi: joi.Root) => ({
  body: joi.object<CreateTokenRequest, true>({
    clientId: joi.string().required(),
    redirectURI: joi.string().uri({ scheme: 'https' }).required(),
    grant: joi.string().required(),
    grantType: joi.string().valid(GrantType.AUTH_CODE).required(),
    secret: joi.string().required(),
  }),
});
