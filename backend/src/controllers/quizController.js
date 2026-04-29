import Document from '../models/Document.js';
import Quiz from '../models/Quiz.js';
import { generateQuizFromUrl } from '../utils/geminiAI.js';

// @desc    Generate a quiz from a document
// @route   POST /api/quizzes/generate/:docId
// @access  Private
export const generateQuiz = async (req, res) => {
  try {
    const document = await Document.findById(req.params.docId);

    if (!document || document.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Document not found or unauthorized' });
    }

    if (!document.filePath) {
      return res.status(404).json({ message: 'Document file URL missing' });
    }

    const count = req.body.count || 5;

    // Send the Cloudinary URL directly to Gemini for processing
    const questions = await generateQuizFromUrl(document.filePath, count);

    // Save quiz to db
    const quiz = await Quiz.create({
      user: req.user._id,
      document: document._id,
      questions: questions,
      totalQuestions: questions.length,
      score: 0,
      attempted: false
    });

    res.status(201).json({ message: 'Quiz generated', quiz });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ message: 'Server error generating quiz', error: error.message });
  }
};

// @desc    Get all quizzes for a document
// @route   GET /api/quizzes/document/:docId
// @access  Private
export const getQuizzesByDocument = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ document: req.params.docId, user: req.user._id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get specific quiz
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || quiz.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit a quiz attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected options or { questionId: selectedOption }
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz || quiz.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    
    // Calculate score
    quiz.questions.forEach((q, index) => {
      // Simplistic check assuming array of answers matching question index
      if (answers && answers[index] === q.correctAnswer) {
        score += 1;
      }
    });

    quiz.score = score;
    quiz.attempted = true;
    await quiz.save();

    res.json({ message: 'Quiz submitted', score, total: quiz.totalQuestions, quiz });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error submitting' });
  }
};
