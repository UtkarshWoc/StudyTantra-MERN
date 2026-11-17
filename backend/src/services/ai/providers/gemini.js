import { GoogleGenAI } from '@google/genai';
import { env } from '../../../config/env.js';
import { logger } from '../../../config/logger.js';

let client;
const getClient = () => {
  client ??= new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  return client;
};

const isRetryable = (err) => {
  const status = err?.status ?? err?.code;
  return status === 429 || (status >= 500 && status < 600) || /fetch failed|ECONNRESET|ETIMEDOUT/i.test(err?.message || '');
};

// Retry transient failures (rate limits, 5xx, network) with exponential backoff.
const withRetry = async (fn, { retries = 2, baseMs = 800 } = {}) => {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries || !isRetryable(err)) throw err;
      const delay = baseMs * 2 ** attempt;
      logger.warn({ err: err.message, attempt, delay }, 'Gemini call failed, retrying');
      await new Promise((r) => setTimeout(r, delay));
    }
  }
};

// Extract retry delay from Gemini rate-limit (429) errors, or use a reasonable fallback.
const parseRetryDelayMs = (err) => {
  try {
    const msg = typeof err?.message === 'string' ? err.message : '';
    const match = msg.match(/retry in ([\d\.]+)s/i);
    if (match) return Math.min(45_000, Math.ceil(parseFloat(match[1]) * 1000) + 1000);

    const details = err?.details;
    if (Array.isArray(details)) {
      for (const d of details) {
        if (d?.retryDelay) {
          const s = parseInt(d.retryDelay, 10);
          if (!isNaN(s) && s > 0) return Math.min(45_000, s * 1000 + 1000);
        }
      }
    }
  } catch {}
  return 10_000; // 10s default backoff instead of stalling for over a minute
};

const MAX_QUOTA_WAITS = 4;
const withQuotaWait = async (fn) => {
  for (let waited = 0; ; waited++) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.status ?? err?.code;
      if (status !== 429 || waited >= MAX_QUOTA_WAITS) throw err;
      const waitMs = parseRetryDelayMs(err);
      logger.warn({ waited, waitMs }, 'Gemini rate quota reached; waiting before retry');
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
};

const toContents = ({ history = [], parts }) => [
  ...history.map((m) => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.content }] })),
  { role: 'user', parts },
];

export const geminiProvider = {
  name: 'gemini',

  async generateText({ system, parts, history, model = env.GEMINI_MODEL, temperature }) {
    const res = await withRetry(() => getClient().models.generateContent({
      model,
      contents: toContents({ history, parts }),
      config: { systemInstruction: system, temperature },
    }));
    return res.text ?? '';
  },

  async *streamText({ system, parts, history, model = env.GEMINI_MODEL, temperature }) {
    const stream = await withRetry(() => getClient().models.generateContentStream({
      model,
      contents: toContents({ history, parts }),
      config: { systemInstruction: system, temperature },
    }));
    for await (const chunk of stream) {
      if (chunk.text) yield chunk.text;
    }
  },

  async generateJSON({ system, parts, schema, model = env.GEMINI_MODEL, temperature }) {
    const res = await withRetry(() => getClient().models.generateContent({
      model,
      contents: toContents({ parts }),
      config: {
        systemInstruction: system,
        temperature,
        responseMimeType: 'application/json',
        responseJsonSchema: schema,
      },
    }));
    try {
      return JSON.parse(res.text ?? '');
    } catch {
      logger.error({ text: res.text?.slice(0, 500) }, 'AI returned malformed JSON');
      const err = new Error('The AI returned malformed data. Please try again.');
      err.status = 502;
      err.expose = true;
      throw err;
    }
  },

  async embed(texts, { taskType = 'RETRIEVAL_DOCUMENT', dimensions = 768 } = {}) {
    const vectors = [];
    // Batches of 10 chunks stay safely under the free tier limit of 30,000 tokens/minute.
    const BATCH_SIZE = 10;
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      if (i > 0) await new Promise((r) => setTimeout(r, 200)); // Brief stagger to prevent burst limits
      const batch = texts.slice(i, i + BATCH_SIZE);
      const res = await withQuotaWait(() => withRetry(() => getClient().models.embedContent({
        model: env.GEMINI_EMBED_MODEL,
        contents: batch,
        config: { taskType, outputDimensionality: dimensions },
      })));
      vectors.push(...(res.embeddings || []).map((e) => e.values || []));
    }
    return vectors;
  },
};
