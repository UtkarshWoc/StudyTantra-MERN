import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';

// @desc    Get dashboard metrics for user
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Run aggregations in parallel
    const [
      totalDocuments,
      totalFlashcards,
      quizzes,
      recentActivity
    ] = await Promise.all([
      Document.countDocuments({ user: userId }),
      Flashcard.countDocuments({ user: userId }),
      Quiz.find({ user: userId }),
      
      // Get recent documents as activity
      Document.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title createdAt')
    ]);

    // Calculate quiz stats
    let totalQuizzes = quizzes.length;
    let averageScore = 0;
    
    if (totalQuizzes > 0) {
      const attemptedQuizzes = quizzes.filter(q => q.attempted);
      if (attemptedQuizzes.length > 0) {
        const totalScore = attemptedQuizzes.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0);
        averageScore = (totalScore / attemptedQuizzes.length).toFixed(1);
      }
    }

    res.json({
      metrics: {
        totalDocuments,
        totalFlashcards,
        totalQuizzes,
        averageScore: Number(averageScore)
      },
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error retrieving dashboard stats' });
  }
};
