import { BaseClient, Client, ClientModel } from './ClientModel';

describe('ClientModel', () => {
  const testClient: BaseClient = {
    adminId: 'user_id.4t8B7BPU_bcHCR7UmUR02spwEUZFyIQ6RnXGWVfntvU',
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

  test('generateId() should generate a valid client id', () => {
    const clientId = ClientModel.generateId();
    expect(clientId).toContain('.');

    const [prefix, token] = clientId.split('.');
    expect(prefix).toBe('client_id');
    expect(token).toBeTruthy();
  });

  test('create() should create a client and insert it into database', async () => {
    const client = await ClientModel.create(testClient);
    const result = await ClientModel.collection.findOne({
      clientId: client.clientId,
    });

    const { secret: _, ...matchProps } = testClient;

    expect(result).toBeDefined();
    expect(result).toEqual(
      expect.objectContaining({
        ...matchProps,
        jwt: {
          privateKey: expect.any(String),
          publicKey: expect.any(String),
        },
      })
    );
  });

  test('create() should not return secret and jwt keys', async () => {
    const client = await ClientModel.create(testClient);
    expect((client as Client).jwt).toBeUndefined();
    expect((client as Client).secret).toBeUndefined();
  });
});
