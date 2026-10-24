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
  },
  // FSRS scheduling state (services/srs.js). Absent = new card, due immediately.
  srs: {
    type: new mongoose.Schema({
      due: Date,
      stability: Number,
      difficulty: Number,
      elapsed_days: Number,
      scheduled_days: Number,
      learning_steps: Number,
      reps: Number,
      lapses: Number,
      state: Number,
      last_review: Date,
    }, { _id: false }),
    default: undefined,
  },
}, {
  timestamps: true,
});

flashcardSchema.index({ user: 1, document: 1 });
flashcardSchema.index({ user: 1, 'srs.due': 1 });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
export default Flashcard;
