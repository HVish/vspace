import MongoService from '../db';
import { IBaseClient, Client, GrantType, ClientCredential } from './Client';

describe('Client Model', () => {
  const testClient: IBaseClient = {
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
    const client = await Client.create(testClient);
    const result = await Client.get(client.clientId);

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
      Client.verifyCredentials({
        ...correctCredentials,
        secret: 'wrong_secret',
      }),
      Client.verifyCredentials({
        ...correctCredentials,
        redirectURI: 'https://localhost/un-registered-url',
      }),
      Client.verifyCredentials({
        ...correctCredentials,
        grantType: GrantType.AUTH_TOKEN, // unregistered token type for this client
      }),
    ]);

    shouldBeFalseArray.forEach((result) => expect(result).toBe(false));

    const shouldBeTrue = await Client.verifyCredentials(correctCredentials);

    expect(shouldBeTrue).toBe(true);
  });
});
