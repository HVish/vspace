import { InvalidCredentialsError } from '../shared/errors';
import { UsernameExistsError } from './errors';
import { UserController } from './UserController';
import { BaseUserWithoutId, UserModel } from './UserModel';

describe('UserController', () => {
  const testUser: BaseUserWithoutId = {
    name: 'test name',
    avatar: 'https://localhost/images/test.png',
    password: 'test_password',
    username: 'test_username',
  };

  beforeAll(async () => {
    await UserModel.create(testUser);
  });

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
    expect(result).toMatchObject({
      userId: expect.any(String),
      accessToken: expect.objectContaining({
        expiresAt: expect.any(Number),
        value: expect.any(String),
      }),
    });
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
    expect(result).toMatchObject({
      userId: expect.any(String),
      accessToken: expect.objectContaining({
        expiresAt: expect.any(Number),
        value: expect.any(String),
      }),
    });
  });
});
