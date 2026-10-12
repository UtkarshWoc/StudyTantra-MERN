import mongoose from 'mongoose';

// Append-only study log. Powers streaks, the activity heatmap, the recent
// activity feed and flashcard-based weak-topic stats.
const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  type: { type: String, enum: ['upload', 'review', 'quiz', 'chat', 'generate'], required: true },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  // Free-form details, e.g. { rating, topic, wasNew } for reviews, { score, total } for quizzes
  meta: { type: mongoose.Schema.Types.Mixed },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ user: 1, type: 1, createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
