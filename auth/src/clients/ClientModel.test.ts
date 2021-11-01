import { BaseClient, ClientModel, GrantType } from './ClientModel';

describe('ClientModel', () => {
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

  test('it should generate a valid client id', () => {
    const clientId = ClientModel.generateId();
    expect(clientId).toContain('.');

    const [prefix, token] = clientId.split('.');
    expect(prefix).toBe('client_id');
    expect(token).toBeTruthy();
  });

  test('it should create a client and insert it into database', async () => {
    const client = await ClientModel.create(testClient);
    const result = await ClientModel.collection.findOne({
      clientId: client.clientId,
    });

    const { secret: _, ...matchProps } = testClient;

    expect(result).toBeDefined();
    expect(result).toEqual(expect.objectContaining(matchProps));
  });
});
