import './NullOrAny';

import MongoService from '../db';

beforeAll(async () => {
  await MongoService.start();
});

afterAll(async () => {
  await MongoService.client.close();
});
