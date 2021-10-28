import { UsernameExistsError } from './errors';
import { UserController } from './UserController';
import { BaseUser, UserModel } from './UserModel';

describe('UserController', () => {
  const testUser: BaseUser = {
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
      accessToken: expect.any(String),
    });
  });
});
