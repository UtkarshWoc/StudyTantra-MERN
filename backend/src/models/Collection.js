import mongoose from 'mongoose';

// A user-defined group of documents (e.g. a subject or semester).
const collectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  color: { type: String, default: 'amber' },
}, {
  timestamps: true,
});

collectionSchema.index({ user: 1, name: 1 }, { unique: true });

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
