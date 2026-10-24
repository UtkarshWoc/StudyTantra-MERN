import Document from '../models/Document.js';
import { summarize, explainSelection } from '../services/ai/index.js';
import { buildStudySource, ensureReady } from '../services/studySource.js';
import { retrieveChunks } from '../services/retrieval.js';
import { findOwned } from '../utils/ownership.js';

// @desc    Generate summary for a document
// @route   POST /api/ai/summary/:docId
// @access  Private
export const createSummary = async (req, res) => {
  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');
  const { text } = await buildStudySource(document);

  const summary = await summarize({ source: { text } });

  document.summary = summary;
  await document.save();

  res.json({ message: 'Summary generated successfully', summary });
};

// @desc    Explain (or simplify) a passage the student selected in the viewer
// @route   POST /api/ai/explain/:docId
// @access  Private
export const explainPassage = async (req, res) => {
  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');
  ensureReady(document);
  const { text, mode } = req.body;

  // Surrounding context helps resolve terms the passage refers to
  const sources = await retrieveChunks({ documentIds: [document._id], query: text, k: 3 });
  const explanation = await explainSelection({ selection: text, sources, mode });

  res.json({ explanation });
};
