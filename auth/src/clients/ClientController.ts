import { InvalidCredentialsError } from '../shared/errors';
import { UserModel } from '../users/UserModel';
import { Hash } from '../utils/hash';
import { ClientModel, GrantType } from './ClientModel';
import { UnSupportedGrantTypeError } from './errors';
import {
  ClientCredentials,
  CreateTokenRequest,
  LaunchRequest,
} from './validators';

export interface AuthroizeResponse {
  accessToken: {
    value: string;
    expiresAt: UnixTime;
  };
  refreshToken: {
    value: string;
    expiresAt: UnixTime;
  };
}

export const ClientController = Object.freeze({
  async verifyLaunch({ clientId, redirectURI }: LaunchRequest) {
    const client = await ClientModel.collection.findOne({
      clientId,
      redirectURIs: redirectURI,
    });

    if (!client) {
      throw new InvalidCredentialsError();
    }

    return true;
  },
  async verifyCredentials({
    clientId,
    redirectURI,
    secret,
  }: ClientCredentials) {
    const client = await ClientModel.collection.findOne({
      clientId,
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
    grant,
    grantType,
    ...credentials
  }: CreateTokenRequest): Promise<AuthroizeResponse> {
    const { clientId } = credentials;
    await this.verifyCredentials(credentials);

    if (grantType !== GrantType.AUTH_CODE) {
      throw new UnSupportedGrantTypeError();
    }

    const user = await UserModel.collection.findOne({
      authCodes: {
        $elemMatch: { clientId, value: grant },
      },
    });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const { userId } = user;

    const [accessToken, refreshToken] = await Promise.all([
      UserModel.createAccessToken(userId, credentials.clientId),
      UserModel.createRefreshToken(userId, credentials.clientId),
      UserModel.deleteAuthCode(grant, userId),
    ]);

    return { accessToken, refreshToken };
  },
});
