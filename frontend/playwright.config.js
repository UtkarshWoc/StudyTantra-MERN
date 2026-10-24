import { defineConfig, devices } from '@playwright/test';

const API_PORT = 5055;
const WEB_PORT = 5174;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node ../backend/scripts/e2e-server.js',
      url: `http://localhost:${API_PORT}/healthz`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { E2E_PORT: String(API_PORT), E2E_CLIENT_ORIGIN: `http://localhost:${WEB_PORT}` },
    },
    {
      command: `npx vite --port ${WEB_PORT} --strictPort`,
      url: `http://localhost:${WEB_PORT}`,
      reuseExistingServer: !process.env.CI,
      env: { VITE_API_URL: `http://localhost:${API_PORT}` },
    },
  ],
});
