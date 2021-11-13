import { ObjectId, WithId } from 'mongodb';
import MongoService from '../db';
import { DateTime, DateTimeUnit } from '../utils/datetime';
import { BaseUser, UserModel } from './UserModel';

describe('User Model', () => {
  const testUser: WithId<BaseUser> = {
    _id: new ObjectId(),
    name: 'test name',
    avatar: 'https://localhost/images/test.png',
    password: 'test_password',
    username: 'test_username',
  };

  beforeAll(async () => {
    MongoService.start();
  });

  afterAll(async () => {
    await MongoService.client.close();
  });

  test('should create a user', async () => {
    const user = await UserModel.create(testUser);
    const result = await UserModel.collection.findOne(user._id);

    const { password: _, ...matchProps } = testUser;

    expect(result).toBeDefined();
    expect(result).toEqual(expect.objectContaining(matchProps));
  });

  test('should create auth_code', async () => {
    const clientId = 'test_client_id';
    const authCode = await UserModel.createAuthCode(
      testUser._id.toHexString(),
      clientId
    );

    expect(authCode).toBeTruthy();

    const user = await UserModel.collection.findOne({ _id: testUser._id });
    const authCodeDoc = user?.authCodes.find((ac) => ac.value === authCode);

    expect(authCodeDoc?.value).toBe(authCode);
    expect(authCodeDoc?.clientId).toBe(clientId);

    expect(authCodeDoc?.expiresAt).toBeLessThanOrEqual(
      DateTime.add(Date.now(), 15, DateTimeUnit.MINUTE)
    );
  });

  test('should create access_token', async () => {
    const clientId = 'test_client_id';

    const accessToken1 = await UserModel.createAccessToken(
      testUser._id.toHexString()
    );
    expect(accessToken1).toBeTruthy();

    const accessToken2 = await UserModel.createAccessToken(
      testUser._id.toHexString(),
      clientId
    );
    expect(accessToken2).toBeTruthy();

    expect(accessToken1).not.toBe(accessToken2);
  });

  test('should delete auth_code', async () => {
    const clientId = 'test_client_id';

    const authCode = await UserModel.createAuthCode(
      testUser._id.toHexString(),
      clientId
    );

    let user = await UserModel.collection.findOne({ _id: testUser._id });
    let authCodeDoc = user?.authCodes.find((ac) => ac.value === authCode);
    expect(authCodeDoc?.value).toBe(authCode);

    await UserModel.deleteAuthCode(authCode, testUser._id.toHexString());

    user = await UserModel.collection.findOne({ _id: testUser._id });
    authCodeDoc = user?.authCodes.find((ac) => ac.value === authCode);
    expect(authCodeDoc).toBeUndefined();
  });

  test('should create refresh_token', async () => {
    const clientId = 'test_client_id';
    const refreshToken = await UserModel.createRefreshToken(
      testUser._id.toHexString(),
      clientId
    );

    expect(refreshToken).toBeTruthy();

    const user = await UserModel.collection.findOne({ _id: testUser._id });
    const refreshTokenDoc = user?.refeshTokens.find(
      (rt) => rt.value === refreshToken.value
    );

    expect(refreshTokenDoc?.value).toBe(refreshToken.value);
    expect(refreshTokenDoc?.clientId).toBe(clientId);

    expect(refreshTokenDoc?.expiresAt).toBeLessThanOrEqual(
      DateTime.add(Date.now(), 30, DateTimeUnit.DAY)
    );
  });

  test('should delete refresh_token', async () => {
    const clientId = 'test_client_id';

    const refreshToken = await UserModel.createRefreshToken(
      testUser._id.toHexString(),
      clientId
    );

    let user = await UserModel.collection.findOne({ _id: testUser._id });
    let refreshTokenDoc = user?.refeshTokens.find(
      (ac) => ac.value === refreshToken.value
    );

    expect(refreshTokenDoc?.value).toBe(refreshToken.value);

    await UserModel.deleteRefreshToken(
      refreshToken.value,
      testUser._id.toHexString()
    );

    user = await UserModel.collection.findOne({ _id: testUser._id });
    refreshTokenDoc = user?.refeshTokens.find(
      (ac) => ac.value === refreshToken.value
    );

    expect(refreshTokenDoc).toBeUndefined();
  });
});
