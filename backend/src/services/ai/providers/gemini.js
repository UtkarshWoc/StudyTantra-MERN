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

// Embedding a whole book sends hundreds of texts in a row and trips per-minute
// quotas (free tier counts every text). A 429 clears within the minute, so wait
// it out instead of failing the document.
const QUOTA_WAIT_MS = 62_000;
const MAX_QUOTA_WAITS = 8;
const withQuotaWait = async (fn) => {
  for (let waited = 0; ; waited++) {
    try {
      return await fn();
    } catch (err) {
      if ((err?.status ?? err?.code) !== 429 || waited >= MAX_QUOTA_WAITS) throw err;
      logger.warn({ waited }, 'Gemini quota reached, waiting for the rate-limit window to reset');
      await new Promise((r) => setTimeout(r, QUOTA_WAIT_MS));
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
    // The API accepts batches; keep them modest to stay under request limits.
    for (let i = 0; i < texts.length; i += 50) {
      const batch = texts.slice(i, i + 50);
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
