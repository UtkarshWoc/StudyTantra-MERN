import mongoose from 'mongoose';

// Extracted (or OCR'd) text of one PDF page. Used for page-range generation
// scopes, summaries, and as the source for chunking.
const documentPageSchema = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Document' },
  page: { type: Number, required: true },
  text: { type: String, default: '' },
}, {
  timestamps: false,
});

documentPageSchema.index({ document: 1, page: 1 }, { unique: true });

const DocumentPage = mongoose.model('DocumentPage', documentPageSchema);
export default DocumentPage;
