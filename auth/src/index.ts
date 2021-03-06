import 'dotenv/config';
import 'source-map-support/register';

import MongoService from './db';
import server from './server';

const port = process.env.PORT || 1337;

async function main() {
  await MongoService.start();
  const app = server.listen(port, () => {
    console.log(`Server is started on http://localhost:${port}`);
  });
  return app;
}

export default main();
