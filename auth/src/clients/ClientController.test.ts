import { InvalidCredentials } from '../shared/errors';
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
        InvalidCredentials
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
        InvalidCredentials
      );
    });
  });
});
