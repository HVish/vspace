import { InvalidCredentialsError } from '../shared/errors';
import { User, UserModel } from '../users/UserModel';
import {
  ClientController,
  ClientCredentials,
  LaunchData,
} from './ClientController';
import { BaseClient, ClientModel, GrantType } from './ClientModel';

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
    grantTypes: [GrantType.AUTH_CODE],
  };

  beforeAll(async () => {
    await ClientModel.create(testClient);
  });

  const validLaunchData: LaunchData = {
    clientId: testClient.clientId,
    grantType: testClient.grantTypes[0],
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
      ClientController.verifyLaunch({
        ...validLaunchData,
        grantType: GrantType.ACCESS_TOKEN, // unregistered token type for this client
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
    grantType: testClient.grantTypes[0],
  };

  test('verifyCredentials() should validate correct credentials', async () => {
    const result = await ClientController.verifyCredentials(correctCredentials);
    expect(result).toBe(true);
  });

  test('verifyCredentials() should reject for invalid credentials', async () => {
    const verifyArray = await Promise.allSettled([
      ClientController.verifyCredentials({
        ...correctCredentials,
        secret: 'wrong_secret',
      }),
      ClientController.verifyCredentials({
        ...correctCredentials,
        redirectURI: 'https://localhost/un-registered-url',
      }),
      ClientController.verifyCredentials({
        ...correctCredentials,
        grantType: GrantType.ACCESS_TOKEN, // unregistered token type for this client
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
    let user: User;

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
      grantTypes: [GrantType.AUTH_CODE, GrantType.ACCESS_TOKEN],
    };

    const clientCredentials: ClientCredentials = {
      clientId: client.clientId,
      secret: client.secret,
      redirectURI: client.redirectURIs[0],
      grantType: client.grantTypes[0],
    };

    beforeAll(async () => {
      const [_user] = await Promise.all([
        UserModel.create({
          password: 'test_password',
          avatar: '',
          name: 'some name',
          username: 'username',
        }),
        ClientModel.create(client),
      ]);
      user = _user;
    });

    test('should create auth_code', async () => {
      const result = await ClientController.authorize({
        ...clientCredentials,
        grantType: GrantType.AUTH_CODE,
        userId: user._id.toHexString(),
      });
      expect(result).toEqual(
        expect.objectContaining({
          authCode: expect.any(String),
          grantType: GrantType.AUTH_CODE,
        })
      );
    });

    test('should create access_token', async () => {
      const result = await ClientController.authorize({
        ...clientCredentials,
        grantType: GrantType.ACCESS_TOKEN,
        userId: user._id.toHexString(),
      });
      expect(result).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          grantType: GrantType.ACCESS_TOKEN,
          refreshToken: expect.any(String),
        })
      );
    });
  });
});
