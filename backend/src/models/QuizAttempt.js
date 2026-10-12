import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  answer: { type: String, default: '' },
  correct: { type: Boolean, required: true },
  topic: { type: String, default: 'General' },
  feedback: { type: String },
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quiz' },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  answers: [answerSchema],
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
}, {
  timestamps: true,
});

quizAttemptSchema.index({ user: 1, createdAt: -1 });
quizAttemptSchema.index({ quiz: 1, createdAt: -1 });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;
