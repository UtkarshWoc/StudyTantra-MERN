import Document from '../models/Document.js';
import { generateDocumentSummaryFromUrl } from '../utils/geminiAI.js';

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

    if (!document.filePath) {
      return res.status(404).json({ message: 'Document file URL missing' });
    }

    // Send the Cloudinary URL directly to Gemini for processing
    const summary = await generateDocumentSummaryFromUrl(document.filePath);

    // Save summary in database
    document.summary = summary;
    await document.save();

    res.json({ message: 'Summary generated successfully', summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: 'Server error generating summary', error: error.message });
  }
};
