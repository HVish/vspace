import { joi } from '@vspace/core';
import { GrantType } from './ClientModel';
import {
  CreateTokenValidator,
  CreateTokenRequest,
  LaunchRequest,
  LaunchValidator,
} from './validators';

describe('LaunchValidator', () => {
  const schema = LaunchValidator(joi);

  test('it should return errors', () => {
    const data: LaunchRequest = { clientId: '', redirectURI: '' };
    const result = schema.body.validate(data, { abortEarly: false });
    expect(result.error).toBeDefined();
    const invalidKeys = (result.error?.details || []).map((e) => e.path[0]);
    for (const key in data) {
      expect(invalidKeys).toContain(key);
    }
  });

  test('it should not return errors', () => {
    const data: LaunchRequest = {
      clientId: 'test-client-id',
      redirectURI: 'https://localhost/auth/success',
    };
    const result = schema.body.validate(data);
    expect(result.error).toBeUndefined();
  });

  test('it should accept only a valid HTTPS url scheme', () => {
    const commonValidPayload: Omit<LaunchRequest, 'redirectURI'> = {
      clientId: 'test-client-id',
    };

    const invalidURIInputs: LaunchRequest[] = [
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

    const validURIInputs = [
      {
        ...commonValidPayload,
        redirectURI: 'https://localhost/auth/success',
      },
    ];

    invalidURIInputs.forEach((input) => {
      const result = schema.body.validate(input);
      expect(result.error?.details[0]).toBeDefined();
      expect(result.error?.details[0].path).toContain('redirectURI');
    });

    validURIInputs.forEach((input) => {
      const result = schema.body.validate(input);
      expect(result.error).toBeUndefined();
    });
  });
});

describe('CreateTokenValidator', () => {
  const schema = CreateTokenValidator(joi);

  test('it should return errors', () => {
    const data: CreateTokenRequest = {
      clientId: '',
      grant: '',
      grantType: '' as GrantType.AUTH_CODE,
      redirectURI: '',
      secret: '',
    };
    const result = schema.body.validate(data, { abortEarly: false });
    expect(result.error).toBeDefined();
    const invalidKeys = (result.error?.details || []).map((e) => e.path[0]);
    for (const key in data) {
      expect(invalidKeys).toContain(key);
    }
  });

  test('it should not return errors', () => {
    const data: CreateTokenRequest = {
      clientId: 'test-client-id',
      grant: 'saf134Afdsf!33',
      grantType: GrantType.AUTH_CODE,
      redirectURI: 'https://localhost/auth/success',
      secret: '@1234$$3123##',
    };
    const result = schema.body.validate(data);
    expect(result.error).toBeUndefined();
  });

  test('it should accept only a valid HTTPS url scheme', () => {
    const commonValidPayload: Omit<CreateTokenRequest, 'redirectURI'> = {
      clientId: 'test-client-id',
      grant: 'saf134Afdsf!33',
      grantType: GrantType.AUTH_CODE,
      secret: '@1234$$3123##',
    };

    const invalidURIInputs: CreateTokenRequest[] = [
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

    const validURIInputs = [
      {
        ...commonValidPayload,
        redirectURI: 'https://localhost/auth/success',
      },
    ];

    invalidURIInputs.forEach((input) => {
      const result = schema.body.validate(input);
      expect(result.error?.details[0]).toBeDefined();
      expect(result.error?.details[0].path).toContain('redirectURI');
    });

    validURIInputs.forEach((input) => {
      const result = schema.body.validate(input);
      expect(result.error).toBeUndefined();
    });
  });

  test('should not allow any grant types other than auth_code', () => {
    const data: CreateTokenRequest = {
      clientId: 'test-client-id',
      grant: 'saf134Afdsf!33',
      grantType: GrantType.AUTH_CODE,
      redirectURI: 'https://localhost/auth/success',
      secret: '@1234$$3123##',
    };
    const result = schema.body.validate({
      ...data,
      grantType: GrantType.ACCESS_TOKEN,
    });
    expect(result.error?.details[0]).toBeDefined();
    expect(result.error?.details[0].path).toContain('grantType');
  });
});
