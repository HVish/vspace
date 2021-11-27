import { joi } from '@vspace/core';
import { GrantType } from './ClientModel';
import { ClientValidator } from './validators';

describe('ClientValidator', () => {
  const schema = ClientValidator(joi);

  test('it should return errors', () => {
    const testQuery = {
      clientId: '',
      redirectURI: '',
      state: '',
      grantType: '',
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
      clientId: 'test-client-id',
      redirectURI: 'https://localhost/auth/success',
      state: 'abc',
      grantType: GrantType.AUTH_CODE,
    });
    expect(result.error).toBeUndefined();
  });

  test('it should accept only a valid HTTPS url scheme', () => {
    const commonValidPayload = {
      clientId: 'test-client-id',
      state: 'abc',
      grantType: GrantType.AUTH_CODE,
    };

    const invalidInputs = [
      {
        ...commonValidPayload,
        redirectURI: 'http://localhost/auth/success',
      },
      {
        ...commonValidPayload,
        redirectURI: 'ftp://localhost/auth/success',
      },
      {
        ...commonValidPayload,
        redirectURI: 'random invalid uri format',
      },
    ];

    const validInputs = [
      {
        ...commonValidPayload,
        redirectURI: 'https://localhost/auth/success',
      },
    ];

    invalidInputs.forEach((input) => {
      const result = schema.body.validate(input);
      expect(result.error?.details[0]).toBeDefined();
      expect(result.error?.details[0].path).toContain('redirectURI');
    });

    validInputs.forEach((input) => {
      const result = schema.body.validate(input);
      expect(result.error).toBeUndefined();
    });
  });

  test('it should accept only valid grantType', () => {
    const commonValidPayload = {
      clientId: 'test-client-id',
      state: 'abc',
      redirectURI: 'https://localhost/auth/success',
    };

    const invalidInputs = [
      {
        ...commonValidPayload,
        grantType: '',
      },
      {
        ...commonValidPayload,
        grantType: 'abc',
      },
    ];

    const validInputs = [
      {
        ...commonValidPayload,
        grantType: GrantType.AUTH_CODE,
      },
    ];

    invalidInputs.forEach((input) => {
      const result = schema.body.validate(input);
      expect(result.error?.details[0]).toBeDefined();
      expect(result.error?.details[0].path).toContain('grantType');
    });

    validInputs.forEach((input) => {
      const result = schema.body.validate(input);
      expect(result.error).toBeUndefined();
    });
  });
});
