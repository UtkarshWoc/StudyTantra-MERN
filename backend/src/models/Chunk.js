import mongoose from 'mongoose';

// A retrievable slice of a document's text with its embedding (see services/ingestion).
const chunkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  document: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Document' },
  index: { type: Number, required: true },
  page: { type: Number, required: true },
  pageEnd: { type: Number, required: true },
  text: { type: String, required: true },
  embedding: { type: [Number], default: undefined },
}, {
  timestamps: false,
});

chunkSchema.index({ document: 1, index: 1 });
chunkSchema.index({ user: 1 });

const Chunk = mongoose.model('Chunk', chunkSchema);
export default Chunk;
