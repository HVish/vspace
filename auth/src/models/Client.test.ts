import { ObjectId } from 'bson';
import { WithId } from 'mongodb';
import MongoService from '../db';
import { IBaseClient, Client, TokenType, ClientCredential } from './Client';

describe('Client Model', () => {
  const testClient: WithId<IBaseClient> = {
    _id: new ObjectId(),
    name: 'company name',
    logo: 'https://localhost/images/company_logo.png',
    secret: 'test_secret',
    redirectURIs: [
      'https://localhost/auth-success',
      'https://localhost/auth-failure',
    ],
    tokenTypes: [TokenType.CODE],
  };

  beforeAll(async () => {
    MongoService.start();
  });

  afterAll(async () => {
    await MongoService.client.close();
  });

  test('it should create a client and insert it into database', async () => {
    const client = await Client.create(testClient);
    const result = await Client.get(client._id.toHexString());

    const { secret: _, ...matchProps } = testClient;
    expect(result).toBeDefined();
    expect(result).toEqual(expect.objectContaining(matchProps));
  });

  test('it should validate correct credentials', async () => {
    const correctCredentials: ClientCredential = {
      clientId: testClient._id.toHexString(),
      secret: 'test_secret',
      redirectURI: 'https://localhost/auth-success',
      tokenType: TokenType.CODE,
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
        tokenType: TokenType.AUTH_TOKEN, // unregistered token type for this clientId
      }),
    ]);
    shouldBeFalseArray.forEach((result) => expect(result).toBe(false));

    const shouldBeTrue = await Client.verifyCredentials(correctCredentials);
    expect(shouldBeTrue).toBe(true);
  });
});
