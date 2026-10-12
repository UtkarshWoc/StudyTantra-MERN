import { defineConfig } from 'vitest/config';
import os from 'os';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    // Each file gets its own in-memory MongoDB; run files serially to keep memory low.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 120_000,
    env: {
      NODE_ENV: 'test',
      AI_PROVIDER: 'mock',
      STORAGE_DRIVER: 'local',
      LOCAL_UPLOAD_DIR: path.join(os.tmpdir(), 'studytantra-test-uploads'),
      JWT_SECRET: 'test-secret-at-least-16-chars',
      MONGO_URI: 'mongodb://placeholder-set-by-tests',
      CLIENT_URL: 'http://localhost:5173',
    },
  },
});
