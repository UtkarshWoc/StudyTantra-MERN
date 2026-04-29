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
  isFavorited: {
    type: Boolean,
    default: false,
  },
  filename: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true, // Cloudinary secure URL
  },
  cloudinaryPublicId: {
    type: String,    // Cloudinary public_id for deletion
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
