import supertest from 'supertest';

import server from './server';

const request = supertest(server);

describe('Test server', () => {
  it('should respond to /ping with a pong message', async () => {
    const response = await request.get('/ping');
    expect(response.status).toBe(200);
    expect(response.text).toBe('pong');
  });
});
