import supertest from 'supertest';

import server from './server';

const request = supertest(server);

test('ping-pong test', async () => {
  const response = await request.get('/ping');
  expect(response.status).toBe(200);
  expect(response.text).toBe('pong');
});
