import pino from 'pino';
import { env, isProd, isTest } from './env.js';

export const logger = pino({
  level: env.LOG_LEVEL || (isTest ? 'silent' : isProd ? 'info' : 'debug'),
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]', '*.password', '*.token'],
    censor: '[redacted]',
  },
  ...(!isProd && !isTest ? { transport: { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } } } : {}),
});
