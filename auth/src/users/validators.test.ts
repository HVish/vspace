import { joi } from '@vspace/core';
import { BaseUser } from './UserModel';
import {
  GetAuthCodeQuery,
  GetAuthCodeValidator,
  LoginBody,
  LoginValidator,
  SignupValidator,
} from './validators';

describe('SignupValidator', () => {
  const schema = SignupValidator(joi);

  test('it should return errors', () => {
    const testQuery: BaseUser = {
      avatar: '',
      name: '',
      username: '',
      password: '',
    };

    const result = schema.body.validate(testQuery, { abortEarly: false });

    expect(result.error).toBeDefined();

    const invalidKeys = (result.error?.details || []).map((e) => e.path[0]);

    for (const key in testQuery) {
      expect(invalidKeys).toContain(key);
    }
  });

  test('it should not return errors', () => {
    const result = schema.body.validate({
      avatar: 'https://localhost/user.png',
      name: 'Test name',
      username: 'user_name',
      password: 'test_password',
    });
    expect(result.error).toBeUndefined();
  });

  test('it should accept only a valid https url scheme for avatar', () => {
    const commonValidPayload: Omit<BaseUser, 'avatar'> = {
      name: 'Test name',
      username: 'user_name',
      password: 'test_password',
    };

    const invalidInputs: BaseUser[] = [
      {
        ...commonValidPayload,
        avatar: 'ftp://localhost/auth/success',
      },
      {
        ...commonValidPayload,
        avatar: 'random invalid uri format',
      },
    ];

    const validInputs = [
      {
        ...commonValidPayload,
        avatar: 'https://localhost/user.png',
      },
    ];

    invalidInputs.forEach((input) => {
      const result = schema.body.validate(input);
      expect(result.error?.details[0]).toBeDefined();
      expect(result.error?.details[0].path).toContain('avatar');
    });

    validInputs.forEach((input) => {
      const result = schema.body.validate(input);
      expect(result.error).toBeUndefined();
    });
  });
});

describe('LoginValidator', () => {
  const schema = LoginValidator(joi);

  test('it should return errors', () => {
    const testQuery: LoginBody = {
      username: '',
      password: '',
    };

    const result = schema.body.validate(testQuery, { abortEarly: false });

    expect(result.error).toBeDefined();

    const invalidKeys = (result.error?.details || []).map((e) => e.path[0]);

    for (const key in testQuery) {
      expect(invalidKeys).toContain(key);
    }
  });

  test('it should not return errors', () => {
    const result = schema.body.validate({
      username: 'user_name',
      password: 'test_password',
    });
    expect(result.error).toBeUndefined();
  });
});

describe('GetAuthCodeValidator', () => {
  const schema = GetAuthCodeValidator(joi);

  test('it should return errors', () => {
    const testQuery: GetAuthCodeQuery = {
      clientId: '',
    };

    const result = schema.query.validate(testQuery, { abortEarly: false });

    expect(result.error).toBeDefined();

    const invalidKeys = (result.error?.details || []).map((e) => e.path[0]);

    for (const key in testQuery) {
      expect(invalidKeys).toContain(key);
    }
  });

  test('it should not return errors', () => {
    const result = schema.query.validate({
      clientId: 'some_client_id',
    });
    expect(result.error).toBeUndefined();
  });
});
