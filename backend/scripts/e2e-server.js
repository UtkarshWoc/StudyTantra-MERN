// Self-contained API for end-to-end tests and demos: in-memory MongoDB, mock AI,
// local file storage. Nothing external is touched.
//   node scripts/e2e-server.js   (PORT defaults to 5055)
import os from 'os';
import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = await MongoMemoryServer.create();

Object.assign(process.env, {
  NODE_ENV: 'test',
  PORT: process.env.E2E_PORT || '5055',
  MONGO_URI: mongod.getUri(),
  JWT_SECRET: 'e2e-secret-at-least-16-chars',
  AI_PROVIDER: 'mock',
  STORAGE_DRIVER: 'local',
  LOCAL_UPLOAD_DIR: path.join(os.tmpdir(), 'studytantra-e2e-uploads'),
  ALLOWED_ORIGIN: process.env.E2E_CLIENT_ORIGIN || 'http://localhost:5174',
  CLIENT_URL: process.env.E2E_CLIENT_ORIGIN || 'http://localhost:5174',
  LOG_LEVEL: 'warn',
});

// Imported only after the environment is set (config/env.js reads it at import time)
const { default: app } = await import('../src/app.js');
const { default: connectDB } = await import('../src/config/db.js');
const { env } = await import('../src/config/env.js');

await connectDB();
const { resumePendingIngestion } = await import('../src/services/ingestion/queue.js');
await resumePendingIngestion();
const server = app.listen(env.PORT, () => console.log(`E2E API listening on http://localhost:${env.PORT}`));

const shutdown = async () => {
  server.close();
  await mongod.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
