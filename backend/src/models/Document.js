import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  isFavorited: {
    type: Boolean,
    default: false,
  },
  // Optional grouping (e.g. "Semester 5 – DBMS")
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    default: null,
  },
  filename: {
    type: String,
    required: true,
  },
  // Private storage location (see services/storage.js)
  storageDriver: {
    type: String,
    enum: ['cloudinary', 'local'],
  },
  storageKey: {
    type: String,
  },
  deliveryType: {
    type: String,
  },
  // Legacy: public Cloudinary URL / public_id for documents uploaded before private storage
  filePath: {
    type: String,
  },
  cloudinaryPublicId: {
    type: String,
  },
  pageCount: {
    type: Number,
  },
  sizeBytes: {
    type: Number,
  },
  summary: {
    type: String, // AI Generated summary
  },
  // Ingestion state (services/ingestion): text extraction, OCR, chunking, embeddings
  status: {
    type: String,
    enum: ['processing', 'ready', 'failed'],
    default: 'processing',
  },
  progress: { type: Number, default: 0 },
  processingError: { type: String },
  ocr: { type: Boolean, default: false },
  textChars: { type: Number },
  chunkCount: { type: Number },
  processedAt: { type: Date },
}, {
  timestamps: true,
  toJSON: {
    // Storage internals must never reach the client; files are served via /api/documents/:id/file
    transform: (doc, ret) => {
      delete ret.filePath;
      delete ret.cloudinaryPublicId;
      delete ret.storageKey;
      delete ret.storageDriver;
      delete ret.deliveryType;
      return ret;
    },
  },
});

documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ user: 1, collectionId: 1 });

const Document = mongoose.model('Document', documentSchema);
export default Document;
