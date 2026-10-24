import DocumentPage from '../models/DocumentPage.js';
import { retrieveChunks } from './retrieval.js';
import { HttpError, badRequest } from '../utils/httpError.js';

/**
 * Generation and chat need extracted text, which exists once ingestion finished.
 */
export const ensureReady = (doc) => {
  if (doc.status === 'failed') throw new HttpError(409, doc.processingError || 'This document could not be processed. Try re-processing it.');
  if (doc.status !== 'ready') throw new HttpError(409, 'This document is still being processed. Please try again in a moment.');
};

const tagged = (page, text) => `[p. ${page}]\n${text}`;

/**
 * Build the text an AI task should read.
 * scope: { type: 'all' } | { type: 'pages', from, to } | { type: 'topic', query }
 * Returns { text, focus } where focus describes the scope for the prompt.
 */
export const buildStudySource = async (doc, scope = { type: 'all' }) => {
  ensureReady(doc);

  if (scope.type === 'topic') {
    const chunks = await retrieveChunks({ documentIds: [doc._id], query: scope.query, k: 12 });
    if (!chunks.length) throw badRequest(`Couldn't find anything about "${scope.query}" in this document`);
    // Keep document order so the material reads naturally
    chunks.sort((a, b) => a.index - b.index);
    return { text: chunks.map((c) => tagged(c.page, c.text)).join('\n\n'), focus: scope.query };
  }

  const filter = { document: doc._id };
  if (scope.type === 'pages') {
    if (scope.from > scope.to) throw badRequest('Page range is invalid');
    if (doc.pageCount && scope.from > doc.pageCount) throw badRequest(`This document only has ${doc.pageCount} pages`);
    filter.page = { $gte: scope.from, $lte: scope.to };
  }

  const pages = await DocumentPage.find(filter).sort({ page: 1 }).lean();
  const text = pages.filter((p) => p.text).map((p) => tagged(p.page, p.text)).join('\n\n');
  if (!text) throw badRequest('No readable text was found in the selected pages');
  return { text, focus: scope.type === 'pages' ? `pages ${scope.from}-${scope.to}` : undefined };
};

// Per-request budget for multi-document material (each document gets an equal share)
const COLLECTION_CHAR_BUDGET = 350_000;

/**
 * Like buildStudySource, across every processed document in a collection.
 * scope: { type: 'all' } | { type: 'topic', query }
 */
export const buildCollectionSource = async (docs, scope = { type: 'all' }) => {
  const ready = docs.filter((d) => d.status === 'ready');
  if (!ready.length) throw new HttpError(409, 'No documents in this collection have finished processing yet.');
  if (scope.type === 'pages') throw badRequest('Page ranges apply to a single document. Use a topic or the whole collection.');

  const titles = new Map(ready.map((d) => [String(d._id), d.title]));

  if (scope.type === 'topic') {
    const chunks = await retrieveChunks({ documentIds: ready.map((d) => d._id), query: scope.query, k: 16 });
    if (!chunks.length) throw badRequest(`Couldn't find anything about "${scope.query}" in this collection`);
    return {
      text: chunks.map((c) => `[${titles.get(String(c.document))} p. ${c.page}]\n${c.text}`).join('\n\n'),
      focus: scope.query,
    };
  }

  const perDoc = Math.floor(COLLECTION_CHAR_BUDGET / ready.length);
  const parts = await Promise.all(ready.map(async (doc) => {
    const pages = await DocumentPage.find({ document: doc._id }).sort({ page: 1 }).lean();
    const text = pages.filter((p) => p.text).map((p) => tagged(p.page, p.text)).join('\n\n').slice(0, perDoc);
    return text ? `=== ${doc.title} ===\n${text}` : '';
  }));
  const text = parts.filter(Boolean).join('\n\n');
  if (!text) throw badRequest('No readable text was found in this collection');
  return { text };
};
