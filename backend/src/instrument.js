// Imported first by server.js so Sentry can instrument modules loaded after it.
import * as Sentry from '@sentry/node';
import { env } from './config/env.js';

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
