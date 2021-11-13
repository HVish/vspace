import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import server from '../server';
import { BaseClient, ClientModel, GrantType } from './ClientModel';

const request = supertest(server);

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
  grantTypes: [GrantType.AUTH_CODE, GrantType.ACCESS_TOKEN],
};

beforeAll(async () => {
  await ClientModel.create(testClient);
});

describe('POST /clients/verify', () => {
  test('should send 200 status', async () => {
    const response = await request.post('/clients/verify').send({
      clientId: testClient.clientId,
      grantType: testClient.grantTypes[0],
      redirectURI: testClient.redirectURIs[0],
      state: '123',
    });
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toMatchObject({
      valid: expect.any(Boolean),
    });
  });
  test('should send 401 status for wrong client redirect URI', async () => {
    const response = await request.post('/clients/verify').send({
      clientId: testClient.clientId,
      grantType: testClient.grantTypes[0],
      redirectURI: 'https://hacker/auth-success',
      state: '123',
    });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
