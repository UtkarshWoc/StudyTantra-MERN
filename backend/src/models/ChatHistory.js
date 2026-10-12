import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // Pages the answer was grounded in (model messages only)
  citations: [{
    _id: false,
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    title: String,
    page: Number,
    pageEnd: Number,
    snippet: String,
  }],
});

const chatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // Exactly one of document / collectionId is set
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
  },
  history: [messageSchema]
}, {
  timestamps: true,
});

chatHistorySchema.index({ user: 1, document: 1 });
chatHistorySchema.index({ user: 1, collectionId: 1 });

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;
