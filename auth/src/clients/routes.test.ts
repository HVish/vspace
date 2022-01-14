import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import server from '../server';
import { User, UserModel } from '../users/UserModel';
import { BaseClient, ClientModel, GrantType } from './ClientModel';

const request = supertest(server);

let user: User;
const testClient: BaseClient = {
  clientId:
    'client_id.ZDHk-5LTLWO0TOVP1WhzKqNliEGk6eIgEUrENoA2SZRMOrWE4o-Br_pcV-nK_zVT4bgFw2UCXGutu_rv_pWqCg',
  secret: 'fNFiPTQRVZOVBSuq',
  name: 'company name',
  logo: 'https://localhost/images/company_logo.png',
  redirectURIs: [
    'https://localhost/auth-success',
    'https://localhost/auth-failure',
  ],
};

beforeAll(async () => {
  const [_user] = await Promise.all([
    await UserModel.create({
      password: 'test_password',
      avatar: '',
      name: 'some name',
      username: 'username',
    }),
    await ClientModel.create(testClient),
  ]);
  user = _user;
});

describe('POST /clients/verify', () => {
  test('should send 200 status', async () => {
    const response = await request.post('/clients/verify').send({
      clientId: testClient.clientId,
      redirectURI: testClient.redirectURIs[0],
    });
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toMatchObject({
      valid: expect.any(Boolean),
    });
  });
  test('should send 401 status for wrong client redirect URI', async () => {
    const response = await request.post('/clients/verify').send({
      clientId: testClient.clientId,
      redirectURI: 'https://hacker/auth-success',
    });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('POST /clients/authorize', () => {
  let jwt: string;
  let authCode: string;

  beforeAll(async () => {
    const userId = user._id.toHexString();
    jwt = (await UserModel.createAccessToken(userId)).value;
    authCode = await UserModel.createAuthCode(userId, testClient.clientId);
  });

  test('should send 200 status', async () => {
    const response = await request
      .post('/clients/authorize')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        clientId: testClient.clientId,
        redirectURI: testClient.redirectURIs[0],
        grant: authCode,
        grantType: GrantType.AUTH_CODE,
        secret: testClient.secret,
      });
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toMatchObject({
      accessToken: expect.objectContaining({
        expiresAt: expect.any(Number),
        value: expect.any(String),
      }),
      refreshToken: expect.objectContaining({
        expiresAt: expect.any(Number),
        value: expect.any(String),
      }),
    });
  });
  test('should send 401 status for wrong client redirect URI', async () => {
    const response = await request
      .post('/clients/authorize')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        clientId: testClient.clientId,
        redirectURI: 'https://hacker/auth-success',
        grant: authCode,
        grantType: GrantType.AUTH_CODE,
        secret: testClient.secret,
      });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
