import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validate } from './middlewares';

describe('validate middleware', () => {
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    mockResponse.status.mockClear();
    mockResponse.json.mockClear();
  });

  it('should return a function', () => {
    const middleware = validate(() => ({}));
    expect(typeof middleware).toBe('function');
  });

  it('should send 412 status code', () => {
    const middleware = validate((joi) => ({
      query: joi.object({
        test: joi.string().required(),
      }),
    }));

    const mockRequest = { query: {} };

    middleware(
      mockRequest as Request,
      mockResponse as unknown as Response,
      jest.fn()
    );

    expect(mockResponse.status.mock.calls[0][0]).toBe(
      StatusCodes.PRECONDITION_FAILED
    );
  });

  it('should not call next()', () => {
    const middleware = validate((joi) => ({
      query: joi.object({
        test: joi.string().required(),
      }),
    }));

    const mockRequest = { query: {} };
    const next = jest.fn();

    middleware(
      mockRequest as Request,
      mockResponse as unknown as Response,
      next
    );

    expect(next.mock.calls.length).toBe(0);
  });

  it('response json should have property errors.query', () => {
    const middleware = validate((joi) => ({
      query: joi.object({
        test: joi.string().required(),
      }),
    }));

    const mockRequest = { query: {} };

    middleware(
      mockRequest as Request,
      mockResponse as unknown as Response,
      jest.fn()
    );

    const param1 = mockResponse.json.mock.calls[0][0];

    expect(param1).toHaveProperty('errors.query');
    expect(param1.errors.query).toBeDefined();

    expect(param1.errors.body).toBeUndefined();
  });

  it('response json should have property errors.body', () => {
    const middleware = validate((joi) => ({
      body: joi.object({
        test: joi.string().required(),
      }),
    }));

    const mockRequest = { body: {} };

    middleware(
      mockRequest as Request,
      mockResponse as unknown as Response,
      jest.fn()
    );

    const param1 = mockResponse.json.mock.calls[0][0];

    expect(param1).toHaveProperty('errors.body');
    expect(param1.errors.body).toBeDefined();

    expect(param1.errors.query).toBeUndefined();
  });
});
