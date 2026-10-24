import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';

// @desc    Get dashboard metrics for user
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  const userId = req.user._id;

  const [totalDocuments, totalFlashcards, quizStats, recentActivity] = await Promise.all([
    Document.countDocuments({ user: userId }),
    Flashcard.countDocuments({ user: userId }),
    Quiz.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          // Average of per-quiz percentages, only over attempted quizzes
          averageScore: {
            $avg: {
              $cond: [
                { $and: ['$attempted', { $gt: ['$totalQuestions', 0] }] },
                { $multiply: [{ $divide: ['$score', '$totalQuestions'] }, 100] },
                null,
              ],
            },
          },
        },
      },
    ]),
    Document.find({ user: userId }).sort({ createdAt: -1 }).limit(5).select('title createdAt'),
  ]);

  const { totalQuizzes = 0, averageScore = null } = quizStats[0] || {};

  res.json({
    metrics: {
      totalDocuments,
      totalFlashcards,
      totalQuizzes,
      averageScore: averageScore === null ? 0 : Number(averageScore.toFixed(1)),
    },
    recentActivity,
  });
};
