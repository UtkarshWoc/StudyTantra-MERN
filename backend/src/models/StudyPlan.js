import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  type: { type: String, enum: ['read', 'review', 'flashcards', 'quiz'], default: 'review' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  topic: { type: String },
  minutes: { type: Number, default: 30 },
  done: { type: Boolean, default: false },
});

const daySchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD in the user's timezone
  tasks: [taskSchema],
}, { _id: false });

// An exam-prep schedule generated from the user's documents and weak topics.
const studyPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  examDate: { type: String, required: true }, // YYYY-MM-DD
  minutesPerDay: { type: Number, default: 60 },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  days: [daySchema],
}, {
  timestamps: true,
});

studyPlanSchema.index({ user: 1, examDate: 1 });

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
export default StudyPlan;
