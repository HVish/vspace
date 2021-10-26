import { Hash } from '../utils/hash';
import { ClientModel, GrantType } from './ClientModel';
import { InvalidCredentials } from './errors';

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

export const AuthController = Object.freeze({
  async verifyLaunch({ clientId, grantType, redirectURI }: LaunchData) {
    const client = await ClientModel.collection.findOne({
      clientId,
      grantTypes: grantType,
      redirectURIs: redirectURI,
    });

    if (!client) {
      throw new InvalidCredentials();
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
      throw new InvalidCredentials();
    }

    const isMatch = await Hash.compare(secret, client.secret);

    if (!isMatch) {
      throw new InvalidCredentials();
    }

    return true;
  },
});
