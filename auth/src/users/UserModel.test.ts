import { DateTime, DateTimeUnit } from '../utils/datetime';
import { BaseUser, UserModel } from './UserModel';

describe('User Model', () => {
  const testUser: BaseUser = {
    userId: 'user_id.hCHmz35MSKbWepwR_qNlTY7NjkaMbxLeJ6jBZIUnd44',
    name: 'test name',
    avatar: 'https://localhost/images/test.png',
    password: 'test_password',
    username: 'test_username',
  };

  test('should create a user', async () => {
    await UserModel.create(testUser);
    const result = await UserModel.collection.findOne({ userId: testUser.userId });

    const { password: _, ...matchProps } = testUser;

    expect(result).toBeDefined();
    expect(result).toEqual(expect.objectContaining(matchProps));
  });

  test('should create auth_code', async () => {
    const clientId = 'test_client_id';
    const authCode = await UserModel.createAuthCode(testUser.userId, clientId);

    expect(authCode).toBeTruthy();

    const user = await UserModel.collection.findOne({
      userId: testUser.userId,
    });
    const authCodeDoc = user?.authCodes.find((ac) => ac.value === authCode);

    expect(authCodeDoc?.value).toBe(authCode);
    expect(authCodeDoc?.clientId).toBe(clientId);

    expect(authCodeDoc?.expiresAt).toBeLessThanOrEqual(
      DateTime.add(Date.now(), 15, DateTimeUnit.MINUTE)
    );
  });

  test('should create access_token', async () => {
    const clientId = 'test_client_id';

    const accessToken1 = await UserModel.createAccessToken(testUser.userId);
    expect(accessToken1).toBeTruthy();

    const accessToken2 = await UserModel.createAccessToken(
      testUser.userId,
      clientId
    );
    expect(accessToken2).toBeTruthy();

    expect(accessToken1).not.toBe(accessToken2);
  });

  test('should delete auth_code', async () => {
    const clientId = 'test_client_id';

    const authCode = await UserModel.createAuthCode(testUser.userId, clientId);

    let user = await UserModel.collection.findOne({ userId: testUser.userId });
    let authCodeDoc = user?.authCodes.find((ac) => ac.value === authCode);
    expect(authCodeDoc?.value).toBe(authCode);

    await UserModel.deleteAuthCode(authCode, testUser.userId);

    user = await UserModel.collection.findOne({ userId: testUser.userId });
    authCodeDoc = user?.authCodes.find((ac) => ac.value === authCode);
    expect(authCodeDoc).toBeUndefined();
  });

  test('should create refresh_token', async () => {
    const clientId = 'test_client_id';
    const refreshToken = await UserModel.createRefreshToken(
      testUser.userId,
      clientId
    );

    expect(refreshToken).toBeTruthy();

    const user = await UserModel.collection.findOne({
      userId: testUser.userId,
    });
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
      testUser.userId,
      clientId
    );

    let user = await UserModel.collection.findOne({ userId: testUser.userId });
    let refreshTokenDoc = user?.refeshTokens.find(
      (ac) => ac.value === refreshToken.value
    );

    expect(refreshTokenDoc?.value).toBe(refreshToken.value);

    await UserModel.deleteRefreshToken(refreshToken.value, testUser.userId);

    user = await UserModel.collection.findOne({ userId: testUser.userId });
    refreshTokenDoc = user?.refeshTokens.find(
      (ac) => ac.value === refreshToken.value
    );

    expect(refreshTokenDoc).toBeUndefined();
  });
});
