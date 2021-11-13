import { InvalidCredentialsError } from '../shared/errors';
import { UserModel } from '../users/UserModel';
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

export interface CreateTokenRequest extends ClientCredentials {
  userId: string;
}

interface AuthCodeResponse {
  authCode: string;
  grantType: GrantType;
}

interface AccessTokenResponse {
  accessToken: {
    value: string;
    expiresAt: UnixTime;
  };
  grantType: GrantType;
  refreshToken: {
    value: string;
    expiresAt: UnixTime;
  };
}

type AuthroizeResponse = AuthCodeResponse | AccessTokenResponse;

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
  async authorize({
    userId,
    ...credentials
  }: CreateTokenRequest): Promise<AuthroizeResponse> {
    await this.verifyCredentials(credentials);
    const { grantType } = credentials;
    switch (grantType) {
      case GrantType.AUTH_CODE: {
        const authCode = await UserModel.createAuthCode(
          userId,
          credentials.clientId
        );
        return { authCode, grantType };
      }
      case GrantType.ACCESS_TOKEN: {
        const [accessToken, refreshToken] = await Promise.all([
          UserModel.createAccessToken(userId, credentials.clientId),
          UserModel.createRefreshToken(userId, credentials.clientId),
        ]);
        return { accessToken, grantType, refreshToken };
      }
    }
  },
});
