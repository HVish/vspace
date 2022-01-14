import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import server from '../server';
import { BaseUser, UserModel } from './UserModel';
import { LoginBody } from './validators';

const request = supertest(server);

describe('POST /users/v1', () => {
  const testUser: BaseUser = {
    name: 'test name',
    avatar: 'https://localhost/images/test.png',
    password: 'test_password',
    username: 'test_username1',
  };

  test('should send 201 status', async () => {
    const response = await request.post('/users/v1').send(testUser);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toMatchObject({
      userId: expect.any(String),
      accessToken: expect.objectContaining({
        expiresAt: expect.any(Number),
        value: expect.any(String),
      }),
    });
  });

  test('should send 412 status for existing username', async () => {
    const response = await request.post('/users/v1').send(testUser);
    expect(response.status).toBe(StatusCodes.PRECONDITION_FAILED);
  });
});

describe('POST /users/v1/login', () => {
  const testUser: BaseUser = {
    name: 'test name',
    avatar: 'https://localhost/images/test.png',
    password: 'test_password',
    username: 'login_username',
  };

  beforeAll(async () => {
    await UserModel.create(testUser);
  });

  test('should send 201 status', async () => {
    const loginRequest: LoginBody = {
      username: testUser.username,
      password: testUser.password,
    };
    const response = await request.post('/users/v1/login').send(loginRequest);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toMatchObject({
      userId: expect.any(String),
      accessToken: expect.objectContaining({
        expiresAt: expect.any(Number),
        value: expect.any(String),
      }),
    });
  });

  test('should send 412 status for missing fields', async () => {
    const responses = await Promise.all([
      request.post('/users/v1/login').send({ username: testUser.username }),
      request.post('/users/v1/login').send({ password: testUser.password }),
    ]);
    responses.forEach((response) => {
      expect(response.status).toBe(StatusCodes.PRECONDITION_FAILED);
    });
  });

  test('should send 401 status for wrong credentials', async () => {
    const loginRequest: LoginBody = {
      username: testUser.username,
      password: 'wrong_password',
    };
    const response = await request.post('/users/v1/login').send(loginRequest);
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
