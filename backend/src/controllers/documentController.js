import Document from '../models/Document.js';
import Collection from '../models/Collection.js';
import { recordActivity } from '../services/activity.js';
import { saveFile, readFile } from '../services/storage.js';
import { deleteDocumentCascade } from '../services/cascade.js';
import { enqueueIngestion } from '../services/ingestion/queue.js';
import { findOwned } from '../utils/ownership.js';
import { badRequest, conflict } from '../utils/httpError.js';

const isPdf = (buffer) => buffer?.subarray(0, 5).toString('latin1') === '%PDF-';

// @desc    Upload new document
// @route   POST /api/documents
// @access  Private
export const uploadDocument = async (req, res) => {
  if (!req.file) throw badRequest('No file uploaded');

  // The mimetype header is client-controlled; check the actual bytes too.
  if (!isPdf(req.file.buffer)) throw badRequest('File is not a valid PDF');

  const stored = await saveFile(req.file.buffer, req.file.originalname);
  const title = (req.body.title || req.file.originalname.replace(/\.pdf$/i, '')).trim().slice(0, 200);

  const document = await Document.create({
    user: req.user._id,
    title: title || 'Untitled document',
    filename: req.file.originalname,
    ...stored,
    sizeBytes: req.file.size || req.file.buffer.length,
    status: 'processing',
  });

  // Text extraction, OCR and embeddings run in the background; the client polls status.
  enqueueIngestion(document._id);
  await recordActivity(req.user._id, 'upload', { document: document._id });
  res.status(201).json(document);
};

// @desc    Get all documents for logged in user
// @route   GET /api/documents
// @access  Private
export const getUserDocuments = async (req, res) => {
  const documents = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(documents);
};

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Private
export const getDocumentById = async (req, res) => {
  const document = await findOwned(Document, req.params.id, req.user._id, 'Document');
  res.json(document);
};

// @desc    Stream the document's PDF (files are private; this is the only way to read them)
// @route   GET /api/documents/:id/file
// @access  Private
export const getDocumentFile = async (req, res) => {
  const document = await findOwned(Document, req.params.id, req.user._id, 'Document');
  const buffer = await readFile(document);
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Length': buffer.length,
    'Content-Disposition': `inline; filename="${encodeURIComponent(document.filename)}"`,
    'Cache-Control': 'private, max-age=300',
  });
  res.send(buffer);
};

// @desc    Re-run ingestion (e.g. after a failure)
// @route   POST /api/documents/:id/reprocess
// @access  Private
export const reprocessDocument = async (req, res) => {
  const document = await findOwned(Document, req.params.id, req.user._id, 'Document');
  if (document.status === 'processing') throw conflict('This document is already being processed');
  document.status = 'processing';
  document.progress = 0;
  document.processingError = undefined;
  await document.save();
  enqueueIngestion(document._id);
  res.status(202).json(document);
};

// @desc    Rename a document or move it into/out of a collection
// @route   PATCH /api/documents/:id
// @access  Private
export const updateDocument = async (req, res) => {
  const document = await findOwned(Document, req.params.id, req.user._id, 'Document');
  const { title, collectionId } = req.body;
  if (title) document.title = title;
  if (collectionId !== undefined) {
    if (collectionId) await findOwned(Collection, collectionId, req.user._id, 'Collection');
    document.collectionId = collectionId;
  }
  await document.save();
  res.json(document);
};

// @desc    Delete a document and everything generated from it
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res) => {
  const document = await findOwned(Document, req.params.id, req.user._id, 'Document');
  await deleteDocumentCascade(document);
  res.json({ message: 'Document removed' });
};

// @desc    Toggle favorite status of a document
// @route   PUT /api/documents/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  const document = await findOwned(Document, req.params.id, req.user._id, 'Document');
  document.isFavorited = !document.isFavorited;
  await document.save();
  res.json(document);
};
