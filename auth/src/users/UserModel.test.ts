import MongoService from '../db';
import { BaseUser, UserModel } from './UserModel';

describe('User Model', () => {
  const testUser: BaseUser = {
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

  test('it should create a user and insert it into database', async () => {
    const user = await UserModel.create(testUser);
    const result = await UserModel.get(user._id.toHexString());

    const { password: _, ...matchProps } = testUser;
    expect(result).toBeDefined();
    expect(result).toEqual(expect.objectContaining(matchProps));
  });

  test('it should validate correct credentials', async () => {
    const shouldBeFalse = await UserModel.verifyCredentials(
      'test_username',
      'wrong_password'
    );

    expect(shouldBeFalse).toBe(false);

    const shouldBeTrue = await UserModel.verifyCredentials(
      'test_username',
      'test_password'
    );

    expect(shouldBeTrue).toBe(true);
  });
});
