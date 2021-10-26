import MongoService from '../db';
import { BaseClient, ClientModel, GrantType, ClientCredential } from './ClientModel';

describe('Client Model', () => {
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
    MongoService.start();
  });

  afterAll(async () => {
    await MongoService.client.close();
  });

  test('it should create a client and insert it into database', async () => {
    const client = await ClientModel.create(testClient);
    const result = await ClientModel.get(client.clientId);

    const { secret: _, ...matchProps } = testClient;

    expect(result).toBeDefined();
    expect(result).toEqual(expect.objectContaining(matchProps));
  });

  test('it should validate correct credentials', async () => {
    const correctCredentials: ClientCredential = {
      clientId: testClient.clientId,
      secret: testClient.secret,
      redirectURI: testClient.redirectURIs[0],
      grantType: testClient.grantTypes[0],
    };

    const shouldBeFalseArray = await Promise.all([
      ClientModel.verifyCredentials({
        ...correctCredentials,
        secret: 'wrong_secret',
      }),
      ClientModel.verifyCredentials({
        ...correctCredentials,
        redirectURI: 'https://localhost/un-registered-url',
      }),
      ClientModel.verifyCredentials({
        ...correctCredentials,
        grantType: GrantType.AUTH_TOKEN, // unregistered token type for this client
      }),
    ]);

    shouldBeFalseArray.forEach((result) => expect(result).toBe(false));

    const shouldBeTrue = await ClientModel.verifyCredentials(correctCredentials);

    expect(shouldBeTrue).toBe(true);
  });
});
