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
    const item = pending.shift();
    running += 1;
    ingestDocument(item.id, item.buffer)
      .catch((err) => logger.error({ err }, 'Ingestion job crashed'))
      .finally(() => {
        queued.delete(item.id);
        running -= 1;
        pump();
        settleIdle();
      });
  }
};

export const enqueueIngestion = (documentId, initialBuffer = null) => {
  const id = String(documentId);
  if (queued.has(id)) return;
  queued.add(id);
  pending.push({ id, buffer: initialBuffer });
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
 * Cleans up stale abandoned processing documents so they don't block the queue.
 */
export const resumePendingIngestion = async () => {
  const staleCutoff = new Date(Date.now() - 20 * 60 * 1000);
  try {
    // Mark ancient unfinished documents as failed so they don't loop endlessly
    await Document.updateMany(
      { status: 'processing', updatedAt: { $lt: staleCutoff } },
      {
        status: 'failed',
        processingError: 'Processing timed out. Please use the Retry button to reprocess.',
      }
    );
  } catch (err) {
    logger.warn({ err: err.message }, 'Could not clean up stale documents');
  }

  const docs = await Document.find({
    $or: [{ status: 'processing', updatedAt: { $gte: staleCutoff } }, { status: { $exists: false } }],
  }).select('_id');
  if (docs.length) logger.info({ count: docs.length }, 'Queueing recent documents for ingestion');
  docs.forEach((d) => enqueueIngestion(d._id));
};
