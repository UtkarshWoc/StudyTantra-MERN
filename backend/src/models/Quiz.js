import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq', 'true_false', 'fill_blank', 'short_answer'], default: 'mcq' },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  topic: { type: String, default: 'General' },
});

const quizSchema = new mongoose.Schema({
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
  questions: [questionSchema],
  // How the quiz was generated, shown in the UI
  scope: { type: String },
  difficulty: { type: String },
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  attempted: {
    type: Boolean,
    default: false
  },
  attemptsCount: {
    type: Number,
    default: 0
  },
  bestScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

quizSchema.index({ user: 1, document: 1, createdAt: -1 });

// Strip answers/explanations so a quiz can be taken without the client knowing the key.
quizSchema.methods.toPublicJSON = function () {
  const obj = this.toJSON();
  obj.questions = obj.questions.map(({ correctAnswer, explanation, ...q }) => q);
  return obj;
};

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
