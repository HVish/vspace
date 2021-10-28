// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import server from './server';

const port = process.env.PORT || 1337;

function main() {
  const app = server.listen(port, () => {
    console.log(`Server is started on http://localhost:${port}`);
  });
  return app;
}

export default main();
