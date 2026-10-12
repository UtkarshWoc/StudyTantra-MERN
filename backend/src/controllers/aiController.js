import Document from '../models/Document.js';
import { summarize } from '../services/ai/index.js';
import { readFile } from '../services/storage.js';
import { findOwned } from '../utils/ownership.js';

// @desc    Generate summary for a document
// @route   POST /api/ai/summary/:docId
// @access  Private
export const createSummary = async (req, res) => {
  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');

  const summary = await summarize({ source: { pdf: await readFile(document) } });

  document.summary = summary;
  await document.save();

  res.json({ message: 'Summary generated successfully', summary });
};
