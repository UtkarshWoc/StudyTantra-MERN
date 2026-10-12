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
