import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import server from '../server';
import { BaseUser } from './UserModel';

const request = supertest(server);

describe('POST /users/v1', () => {
  const testUser: BaseUser = {
    name: 'test name',
    avatar: 'https://localhost/images/test.png',
    password: 'test_password',
    username: 'test_username',
  };

  test('should send 201 status', async () => {
    const response = await request.post('/users/v1').send(testUser);
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toMatchObject({
      userId: expect.any(String),
      accessToken: expect.any(String),
    });
  });

  test('should send 412 status for existing username', async () => {
    const response = await request.post('/users/v1').send(testUser);
    expect(response.status).toBe(StatusCodes.PRECONDITION_FAILED);
  });
});
