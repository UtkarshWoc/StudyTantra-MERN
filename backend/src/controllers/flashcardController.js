import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import { generateFlashcardsFromPdf } from '../utils/geminiAI.js';
import { readFile } from '../services/storage.js';
import { findOwned } from '../utils/ownership.js';
import { LIMITS, clampCount } from '../utils/limits.js';

// @desc    Generate flashcards from document using AI
// @route   POST /api/flashcards/generate/:docId
// @access  Private
export const generateFlashcards = async (req, res) => {
  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');
  const count = clampCount(req.body?.count, LIMITS.flashcards);

  const generatedCards = await generateFlashcardsFromPdf(await readFile(document), count);

  const validCards = (Array.isArray(generatedCards) ? generatedCards : [])
    .filter((card) => card.question && card.answer)
    .slice(0, count);

  // Replace the previous deck only once the new one was generated successfully
  await Flashcard.deleteMany({ document: document._id, user: req.user._id });

  const savedFlashcards = await Flashcard.insertMany(validCards.map((card) => ({
    user: req.user._id,
    document: document._id,
    question: card.question,
    answer: card.answer,
    topic: card.topic || 'General',
  })));

  res.status(201).json({ message: `${savedFlashcards.length} flashcards generated!`, flashcards: savedFlashcards });
};

// @desc    Get all flashcards for a specific document
// @route   GET /api/flashcards/:docId
// @access  Private
export const getFlashcardsByDoc = async (req, res) => {
  await findOwned(Document, req.params.docId, req.user._id, 'Document');
  const flashcards = await Flashcard.find({ document: req.params.docId, user: req.user._id });
  res.json(flashcards);
};

// @desc    Toggle favorite status on a flashcard
// @route   PUT /api/flashcards/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  const flashcard = await findOwned(Flashcard, req.params.id, req.user._id, 'Flashcard');
  flashcard.isFavorite = !flashcard.isFavorite;
  await flashcard.save();
  res.json({ message: 'Favorite status updated', isFavorite: flashcard.isFavorite, flashcard });
};
