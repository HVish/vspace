import { InvalidCredentialsError } from '../shared/errors';
import { DateTime, DateTimeUnit } from '../utils/datetime';
import { UsernameExistsError } from './errors';
import { AuthResponse, UserController } from './UserController';
import { BaseUserWithoutId, UserModel } from './UserModel';

describe('UserController', () => {
  const testUser: BaseUserWithoutId = {
    name: 'test name',
    avatar: 'https://localhost/images/test.png',
    password: 'test_password',
    username: 'test_username',
  };

  let refreshToken: string;
  let expiredRefreshToken: string;

  beforeAll(async () => {
    const user = await UserModel.create(testUser);

    let token = await UserModel.createRefreshToken(user.userId, '');
    refreshToken = token.value;

    // create an expired refresh token
    token = await UserModel.createRefreshToken(
      user.userId,
      '',
      DateTime.add(new Date(), -10, DateTimeUnit.DAY)
    );

    expiredRefreshToken = token.value;
  });

  const expectAuthResponse = (response: AuthResponse) => {
    expect(response).toMatchObject({
      userId: expect.any(String),
      accessToken: expect.objectContaining({
        expiresAt: expect.any(Number),
        value: expect.any(String),
      }),
    });
  };

  test('should throw UsernameExistsError for existing username during signup', async () => {
    try {
      await UserModel.create(testUser);
    } catch (error) {
      expect(error).toBeInstanceOf(UsernameExistsError);
    }
  });

  test('should signup user', async () => {
    const result = await UserController.signup({
      ...testUser,
      username: 'some_username',
    });
    expectAuthResponse(result);
  });

  test('should throw InvalidCredentialsError for invalid uesrname in login', async () => {
    try {
      await UserController.login({
        username: 'invalid_username',
        password: testUser.password,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCredentialsError);
    }
  });

  test('should throw InvalidCredentialsError for invalid password in login', async () => {
    try {
      await UserController.login({
        username: testUser.username,
        password: 'invalid_password',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCredentialsError);
    }
  });

  test('should login with valid username and password', async () => {
    const result = await UserController.login({
      username: testUser.username,
      password: testUser.password,
    });
    expectAuthResponse(result);
  });

  test('should not create access_token when invalid refresh_token is provided', async () => {
    const promise = UserController.getAccessTokenByRefreshToken('');
    await expect(promise).rejects.toThrow(InvalidCredentialsError);
  });

  test('should not create access_token when expired refresh_token is provided', async () => {
    const promise =
      UserController.getAccessTokenByRefreshToken(expiredRefreshToken);
    await expect(promise).rejects.toThrow(InvalidCredentialsError);
  });

  test('should create access_token using valid refresh_token', async () => {
    const result = await UserController.getAccessTokenByRefreshToken(
      refreshToken
    );
    expectAuthResponse(result);
  });
});
