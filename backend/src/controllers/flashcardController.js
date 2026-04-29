import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import { generateFlashcardsFromUrl } from '../utils/geminiAI.js';

// @desc    Generate flashcards from document using AI
// @route   POST /api/flashcards/generate/:docId
// @access  Private
export const generateFlashcards = async (req, res) => {
  try {
    const document = await Document.findById(req.params.docId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this document' });
    }

    if (!document.filePath) {
      return res.status(404).json({ message: 'Document file URL missing' });
    }

    // Clear previous flashcards for this document to avoid duplicates when regenerating
    await Flashcard.deleteMany({ document: document._id, user: req.user._id });

    // Number of flashcards to generate
    const count = parseInt(req.body.count, 10) || 10;

    // Send the Cloudinary URL directly to Gemini for processing
    const generatedCards = await generateFlashcardsFromUrl(document.filePath, count);

    // Filter out invalid ones just in case
    const validCards = generatedCards.filter((card) => card.question && card.answer && card.topic);

    // Prepare Flashcard documents for bulk insertion
    const flashcardsToInsert = validCards.map((card) => ({
      user: req.user._id,
      document: document._id,
      question: card.question,
      answer: card.answer,
      topic: card.topic || 'General',
    }));

    // Bulk insert into the database
    const savedFlashcards = await Flashcard.insertMany(flashcardsToInsert);

    res.status(201).json({ message: `${savedFlashcards.length} flashcards generated!`, flashcards: savedFlashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ message: 'Server error generating flashcards', error: error.message });
  }
};

// @desc    Get all flashcards for a specific document
// @route   GET /api/flashcards/:docId
// @access  Private
export const getFlashcardsByDoc = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ document: req.params.docId, user: req.user._id });
    res.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ message: 'Server error fetching flashcards' });
  }
};

// @desc    Toggle favorite status on a flashcard
// @route   PUT /api/flashcards/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    if (flashcard.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this flashcard' });
    }

    flashcard.isFavorite = !flashcard.isFavorite;
    await flashcard.save();

    res.json({ message: 'Favorite status updated', isFavorite: flashcard.isFavorite, flashcard });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: 'Server error updating flashcard' });
  }
};
