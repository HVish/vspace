import Joi from 'joi';
import { launchValidator } from './validators';

describe('launchValidator', () => {
  const schema = launchValidator(Joi);

  test('it should return errors', () => {
    const result = schema.query.validate({
      clientId: '',
      redirectURI: '',
      state: '',
      response_type: '',
    });
    expect(result.error).toBeDefined();
  });

  test('it should not return errors', () => {
    const result = schema.query.validate({
      clientId: 'test-client-id',
      redirectURI: 'https://localhost/auth/success',
      state: 'abc',
      response_type: 'code',
    });
    expect(result.error).toBeUndefined();
  });

  test('it should accept only a valid HTTPS url scheme', () => {
    const commonValidPayload = {
      clientId: 'test-client-id',
      state: 'abc',
      response_type: 'code',
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
      const result = schema.query.validate(input);
      expect(result.error?.details[0]).toBeDefined();
      expect(result.error?.details[0].path).toContain('redirectURI');
    });

    validInputs.forEach((input) => {
      const result = schema.query.validate(input);
      expect(result.error).toBeUndefined();
    });
  });

  test('it should accept only "code" in response_type', () => {
    const commonValidPayload = {
      clientId: 'test-client-id',
      state: 'abc',
      redirectURI: 'https://localhost/auth/success',
    };

    const invalidInputs = [
      {
        ...commonValidPayload,
        response_type: '',
      },
      {
        ...commonValidPayload,
        response_type: 'abc',
      },
    ];

    const validInputs = [
      {
        ...commonValidPayload,
        response_type: 'code',
      },
    ];

    invalidInputs.forEach((input) => {
      const result = schema.query.validate(input);
      expect(result.error?.details[0]).toBeDefined();
      expect(result.error?.details[0].path).toContain('response_type');
    });

    validInputs.forEach((input) => {
      const result = schema.query.validate(input);
      expect(result.error).toBeUndefined();
    });
  });
});
