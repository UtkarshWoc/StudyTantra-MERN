import Document from '../../models/Document.js';
import { ingestDocument } from './ingest.js';
import { logger } from '../../config/logger.js';

// Minimal in-process job queue. Good for a single API instance; with several
// instances, move this to a shared queue (e.g. BullMQ/Redis or Agenda/Mongo).
const CONCURRENCY = 2;
const pending = [];
const queued = new Set();
let running = 0;
let idleResolvers = [];

const settleIdle = () => {
  if (running === 0 && pending.length === 0) {
    idleResolvers.forEach((resolve) => resolve());
    idleResolvers = [];
  }
};

const pump = () => {
  while (running < CONCURRENCY && pending.length) {
    const id = pending.shift();
    running += 1;
    ingestDocument(id)
      .catch((err) => logger.error({ err }, 'Ingestion job crashed'))
      .finally(() => {
        queued.delete(id);
        running -= 1;
        pump();
        settleIdle();
      });
  }
};

export const enqueueIngestion = (documentId) => {
  const id = String(documentId);
  if (queued.has(id)) return;
  queued.add(id);
  pending.push(id);
  pump();
};

/** Resolves when no jobs are queued or running (used by tests and shutdown). */
export const whenIdle = () =>
  new Promise((resolve) => {
    idleResolvers.push(resolve);
    settleIdle();
  });

/**
 * On boot: pick up documents interrupted mid-processing and index documents
 * uploaded before ingestion existed (no status yet).
 */
export const resumePendingIngestion = async () => {
  const docs = await Document.find({ $or: [{ status: 'processing' }, { status: { $exists: false } }] }).select('_id');
  if (docs.length) logger.info({ count: docs.length }, 'Queueing documents for ingestion');
  docs.forEach((d) => enqueueIngestion(d._id));
};
