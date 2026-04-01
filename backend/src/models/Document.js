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
  },
  filename: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  pageCount: {
    type: Number,
  },
  sizeBytes: {
    type: Number,
  },
  summary: {
    type: String, // AI Generated summary
  }
}, {
  timestamps: true,
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
