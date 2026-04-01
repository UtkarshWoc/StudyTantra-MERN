import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import Document from '../models/Document.js';
import { generateDocumentSummary } from '../utils/geminiAI.js';

// @desc    Generate summary for a document
// @route   POST /api/ai/summary/:docId
// @access  Private
export const createSummary = async (req, res) => {
  try {
    const document = await Document.findById(req.params.docId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this document' });
    }

    // Read and parse PDF
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ message: 'Document file missing on server' });
    }

    const dataBuffer = fs.readFileSync(document.filePath);
    const pdfData = await pdfParse(dataBuffer);
    const textContent = pdfData.text;

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from this PDF' });
    }

    // Call Gemini to generate summary
    const summary = await generateDocumentSummary(textContent);

    // Save summary in database
    document.summary = summary;
    await document.save();

    res.json({ message: 'Summary generated successfully', summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: 'Server error generating summary', error: error.message });
  }
};
