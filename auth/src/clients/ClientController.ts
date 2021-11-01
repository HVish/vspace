import { InvalidCredentialsError } from '../shared/errors';
import { Hash } from '../utils/hash';
import { ClientModel, GrantType } from './ClientModel';

export interface LaunchData {
  clientId: string;
  grantType: GrantType;
  redirectURI: string;
}

export interface ClientCredentials {
  clientId: string;
  grantType: GrantType;
  redirectURI: string;
  secret: string;
}

export const ClientController = Object.freeze({
  async verifyLaunch({ clientId, grantType, redirectURI }: LaunchData) {
    const client = await ClientModel.collection.findOne({
      clientId,
      grantTypes: grantType,
      redirectURIs: redirectURI,
    });

    if (!client) {
      throw new InvalidCredentialsError();
    }

    return true;
  },
  async verifyCredentials({
    clientId,
    grantType,
    redirectURI,
    secret,
  }: ClientCredentials) {
    const client = await ClientModel.collection.findOne({
      clientId,
      grantTypes: grantType,
      redirectURIs: redirectURI,
    });

    if (!client) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await Hash.compare(secret, client.secret);

    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    return true;
  },
});
