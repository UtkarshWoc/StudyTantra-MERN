import Document from '../../models/Document.js';
import DocumentPage from '../../models/DocumentPage.js';
import Chunk from '../../models/Chunk.js';
import { readFile } from '../storage.js';
import { extractPdfPages } from '../pdf.js';
import { chunkPages } from './chunk.js';
import { embedTexts, ocrPdf } from '../ai/index.js';
import { logger } from '../../config/logger.js';

// Below this many extracted characters per page we assume a scanned PDF and OCR it.
const MIN_CHARS_PER_PAGE = 40;

const setProgress = (doc, progress, extra = {}) =>
  Document.updateOne({ _id: doc._id }, { progress, ...extra });

/**
 * Extract → (OCR fallback) → store pages → chunk → embed → store chunks.
 * Idempotent: re-running replaces previous pages/chunks for the document.
 */
export const ingestDocument = async (documentId) => {
  const doc = await Document.findById(documentId);
  if (!doc) return;

  try {
    await setProgress(doc, 5, { status: 'processing', processingError: null });
    const buffer = await readFile(doc);

    let { pageCount, pages } = await extractPdfPages(buffer);
    const textChars = pages.reduce((n, p) => n + p.text.length, 0);
    let ocr = false;

    if (textChars < MIN_CHARS_PER_PAGE * Math.max(1, pageCount)) {
      await setProgress(doc, 15);
      const ocrPages = await ocrPdf({ pdf: buffer });
      if (ocrPages.length) {
        pages = ocrPages.map((p, i) => ({ page: p.page || i + 1, text: (p.text || '').trim() }));
        pageCount = Math.max(pageCount, pages.length);
        ocr = true;
      }
    }

    const totalChars = pages.reduce((n, p) => n + (p.text?.trim()?.length || 0), 0);
    if (totalChars === 0) {
      await Document.updateOne({ _id: doc._id }, {
        status: 'failed',
        processingError: 'No readable text could be found or transcribed from this PDF. Please upload a file with readable text or clear scans.',
      });
      return;
    }

    await setProgress(doc, 35);
    await DocumentPage.deleteMany({ document: doc._id });
    await DocumentPage.insertMany(pages.map((p) => ({ document: doc._id, page: p.page, text: p.text })));

    const chunks = chunkPages(pages);
    await setProgress(doc, 50);

    const embeddings = chunks.length ? await embedTexts(chunks.map((c) => c.text), { taskType: 'RETRIEVAL_DOCUMENT' }) : [];
    await setProgress(doc, 90);

    await Chunk.deleteMany({ document: doc._id });
    await Chunk.insertMany(chunks.map((c, i) => ({
      ...c,
      user: doc.user,
      document: doc._id,
      embedding: embeddings[i],
    })));

    await Document.updateOne({ _id: doc._id }, {
      status: 'ready',
      progress: 100,
      pageCount,
      ocr,
      textChars: pages.reduce((n, p) => n + p.text.length, 0),
      chunkCount: chunks.length,
      processedAt: new Date(),
    });
    logger.info({ documentId: String(doc._id), pageCount, chunks: chunks.length, ocr }, 'Document ingested');
  } catch (err) {
    logger.error({ err, documentId: String(doc._id) }, 'Document ingestion failed');
    const status = err?.status ?? err?.code;
    const rateLimited = status === 429;
    const isInvalidPdf = err?.message?.toLowerCase().includes('pdf') || err?.message?.toLowerCase().includes('invalid');
    await Document.updateOne({ _id: doc._id }, {
      status: 'failed',
      processingError: rateLimited
        ? 'The AI service hit its usage limit while indexing this document. Wait a few minutes and use the Retry button.'
        : isInvalidPdf
          ? 'The PDF could not be read. It may be password-protected, corrupted, or an unsupported format. Try a different file.'
          : 'Document indexing failed. Use the Retry button, or upload a different file.',
    });
  }
};
