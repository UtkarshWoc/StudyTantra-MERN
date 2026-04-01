import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import { generateFlashcardsFromText } from '../utils/geminiAI.js';

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

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ message: 'Document file missing on server' });
    }

    const dataBuffer = fs.readFileSync(document.filePath);
    let textContent = '';
    try {
      const pdfData = await pdfParse(dataBuffer);
      textContent = pdfData.text;
    } catch (parseError) {
      console.warn("PDF Parse Error in Flashcards:", parseError.message);
      return res.status(400).json({ message: 'Error: The PDF parser could not read text from this document.' });
    }

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from this PDF' });
    }

    // Number of flashcards to generate
    const count = req.body.count || 10;

    // Call Gemini to generate flashcards
    const generatedCards = await generateFlashcardsFromText(textContent, count);

    // Filter out invalid ones just in case
    const validCards = generatedCards.filter((card) => card.question && card.answer);

    // Prepare Flashcard documents for bulk insertion
    const flashcardsToInsert = validCards.map((card) => ({
      user: req.user._id,
      document: document._id,
      question: card.question,
      answer: card.answer,
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
