import { InvalidCredentialsError } from '../shared/errors';
import { BaseUser, UserModel } from '../users/UserModel';
import { ClientController } from './ClientController';
import { BaseClient, ClientModel, GrantType } from './ClientModel';
import { ClientCredentials, LaunchRequest } from './validators';

describe('ClientController', () => {
  const testClient: BaseClient = {
    clientId:
      'client_id.DofWnfd411fDEyl+EhsRNyRRkv5Q/mPSVqlC/h85NFK2G3b3M1PyUm0oEu/ArnieU8hSyq+PoyRsp8YGTLg/Ag==',
    secret: 'test_secret',
    name: 'company name',
    logo: 'https://localhost/images/company_logo.png',
    redirectURIs: [
      'https://localhost/auth-success',
      'https://localhost/auth-failure',
    ],
  };

  beforeAll(async () => {
    await ClientModel.create(testClient);
  });

  const validLaunchData: LaunchRequest = {
    clientId: testClient.clientId,
    redirectURI: testClient.redirectURIs[0],
  };

  test('verifyLaunch() should allow launch', async () => {
    const result = await ClientController.verifyLaunch(validLaunchData);
    expect(result).toBe(true);
  });

  test('verifyLaunch() should not allow launch', async () => {
    const verifyArray = await Promise.allSettled([
      ClientController.verifyLaunch({
        ...validLaunchData,
        clientId: 'wrong_clientId',
      }),
      ClientController.verifyLaunch({
        ...validLaunchData,
        redirectURI: 'https://localhost/un-registered-url',
      }),
    ]);
    verifyArray.forEach((result) => {
      expect(result.status).toBe('rejected');
      expect((result as PromiseRejectedResult).reason).toBeInstanceOf(
        InvalidCredentialsError
      );
    });
  });

  const correctCredentials: ClientCredentials = {
    clientId: testClient.clientId,
    secret: testClient.secret,
    redirectURI: testClient.redirectURIs[0],
  };

  test('getClientByCredentials() should return client for valid credentials', async () => {
    const result = await ClientController.getClientByCredentials(
      correctCredentials
    );
    expect(result).toEqual(
      expect.objectContaining({
        clientId: correctCredentials.clientId,
      })
    );
  });

  test('getClientByCredentials() should reject for invalid credentials', async () => {
    const verifyArray = await Promise.allSettled([
      ClientController.getClientByCredentials({
        ...correctCredentials,
        secret: 'wrong_secret',
      }),
      ClientController.getClientByCredentials({
        ...correctCredentials,
        redirectURI: 'https://localhost/un-registered-url',
      }),
    ]);
    verifyArray.forEach((result) => {
      expect(result.status).toBe('rejected');
      expect((result as PromiseRejectedResult).reason).toBeInstanceOf(
        InvalidCredentialsError
      );
    });
  });

  describe('authorize()', () => {
    let grant: string;

    const user: BaseUser = {
      userId: 'user_id.S9AHZjEhH5CPmxFxj-GVwmNd7NbPhdryXVvobCmWhFA',
      password: 'test_password',
      avatar: '',
      name: 'some name',
      username: 'username',
    };

    const client: BaseClient = {
      clientId:
        'client_id.tfvJKag-C9KnVwZED7AQJdj1J_qWiwGw7hxexALI4IHTQjEtkcFUREEHjfY-jLUtbpAi3nF2EJB7OMkOB3hFRA',
      secret: 'test_secret',
      name: 'company name',
      logo: 'https://localhost/images/company_logo.png',
      redirectURIs: [
        'https://localhost/auth-success',
        'https://localhost/auth-failure',
      ],
    };

    const clientCredentials: ClientCredentials = {
      clientId: client.clientId,
      secret: client.secret,
      redirectURI: client.redirectURIs[0],
    };

    beforeAll(async () => {
      await Promise.all([UserModel.create(user), ClientModel.create(client)]);
      grant = await UserModel.createAuthCode(user.userId, client.clientId);
    });

    test('should create access_token and refresh_token', async () => {
      const result = await ClientController.authorize({
        ...clientCredentials,
        grant,
        grantType: GrantType.AUTH_CODE,
      });
      const user = await UserModel.collection.findOne({
        'authCodes.value': grant,
      });
      expect(user).toBeFalsy();
      expect(result).toEqual(
        expect.objectContaining({
          accessToken: expect.objectContaining({
            expiresAt: expect.any(Number),
            value: expect.any(String),
          }),
          refreshToken: expect.objectContaining({
            expiresAt: expect.any(Number),
            value: expect.any(String),
          }),
        })
      );
    });
  });
});
