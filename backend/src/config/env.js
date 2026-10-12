import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

const optionalString = z.string().trim().optional().transform((v) => v || undefined);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),

  // Public URL of the frontend — used for links in emails
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  ALLOWED_ORIGIN: optionalString,

  AI_PROVIDER: z.enum(['gemini', 'mock']).default('gemini'),
  GEMINI_API_KEY: optionalString,
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  GEMINI_EMBED_MODEL: z.string().default('gemini-embedding-001'),
  AI_RATE_LIMIT_PER_HOUR: z.coerce.number().int().positive().default(60),

  STORAGE_DRIVER: z.enum(['cloudinary', 'local']).default('cloudinary'),
  LOCAL_UPLOAD_DIR: z.string().default('uploads'),
  CLOUDINARY_CLOUD_NAME: optionalString,
  CLOUDINARY_API_KEY: optionalString,
  CLOUDINARY_API_SECRET: optionalString,

  // Email (password reset / verification). Without RESEND_API_KEY emails are logged.
  RESEND_API_KEY: optionalString,
  EMAIL_FROM: z.string().default('StudyTantra <onboarding@resend.dev>'),

  GOOGLE_CLIENT_ID: optionalString,
  SENTRY_DSN: optionalString,
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).optional(),
}).superRefine((env, ctx) => {
  if (env.AI_PROVIDER === 'gemini' && !env.GEMINI_API_KEY) {
    ctx.addIssue({ code: 'custom', path: ['GEMINI_API_KEY'], message: 'GEMINI_API_KEY is required when AI_PROVIDER=gemini' });
  }
  if (env.STORAGE_DRIVER === 'cloudinary') {
    for (const key of ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']) {
      if (!env[key]) ctx.addIssue({ code: 'custom', path: [key], message: `${key} is required when STORAGE_DRIVER=cloudinary` });
    }
  }
  if (env.NODE_ENV === 'production' && env.AI_PROVIDER === 'mock') {
    ctx.addIssue({ code: 'custom', path: ['AI_PROVIDER'], message: 'AI_PROVIDER=mock is not allowed in production' });
  }
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const problems = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  // Fail fast at boot with a readable message instead of failing on first request.
  console.error(`Invalid environment configuration:\n${problems}`);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
