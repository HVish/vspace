import { MongoClient } from 'mongodb';

const client = new MongoClient(
  process.env.NODE_ENV === 'test'
    ? global.__MONGO_URI__
    : process.env.MONGO_DB_URI
);

interface IMongoService {
  client: MongoClient;
  start(): Promise<MongoClient>;
}

const MongoService: IMongoService = Object.freeze({
  client,

  async start() {
    await this.client.connect();

    const dbName =
      process.env.NODE_ENV === 'test' ? global.__MONGO_DB_NAME__ : undefined;
    // Establish and verify connection
    await this.client.db(dbName).command({ ping: 1 });

    return this.client;
  },
});

export default MongoService;
