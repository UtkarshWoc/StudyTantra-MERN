import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Document',
  },
  topic: {
    type: String,
    required: true,
    default: 'General',
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  lastReviewed: {
    type: Date,
  }
}, {
  timestamps: true,
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
export default Flashcard;
