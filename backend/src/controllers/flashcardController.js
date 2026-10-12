import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import { generateFlashcards as aiGenerateFlashcards } from '../services/ai/index.js';
import { buildStudySource, ensureReady } from '../services/studySource.js';
import { retrieveChunks } from '../services/retrieval.js';
import { findOwned } from '../utils/ownership.js';
import { HttpError } from '../utils/httpError.js';

const normalizeQuestion = (q) => String(q).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const toCards = (generated, { user, document, existing, count }) => {
  const seen = new Set(existing.map(normalizeQuestion));
  const cards = [];
  for (const card of Array.isArray(generated) ? generated : []) {
    if (!card?.question || !card?.answer) continue;
    const key = normalizeQuestion(card.question);
    if (seen.has(key)) continue; // skip duplicates of existing cards
    seen.add(key);
    cards.push({ user, document, question: card.question, answer: card.answer, topic: card.topic || 'General' });
    if (cards.length >= count) break;
  }
  return cards;
};

// @desc    Generate flashcards from document using AI
// @route   POST /api/flashcards/generate/:docId
// @access  Private
export const generateFlashcards = async (req, res) => {
  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');
  const { count, scope, difficulty, replace } = req.body;

  const { text, focus } = await buildStudySource(document, scope);
  const existing = replace ? [] : (await Flashcard.find({ document: document._id, user: req.user._id }).select('question').lean()).map((c) => c.question);

  const generated = await aiGenerateFlashcards({ source: { text }, count, focus, difficulty, avoid: existing });
  const cards = toCards(generated, { user: req.user._id, document: document._id, existing, count });
  if (!cards.length) throw new HttpError(502, 'The AI did not return any new flashcards. Try a different scope.');

  if (replace) await Flashcard.deleteMany({ document: document._id, user: req.user._id });
  const saved = await Flashcard.insertMany(cards);
  const flashcards = await Flashcard.find({ document: document._id, user: req.user._id }).sort({ createdAt: 1 });

  res.status(201).json({ message: `${saved.length} flashcards added`, added: saved.length, flashcards });
};

// @desc    Turn a passage selected in the viewer into one flashcard
// @route   POST /api/flashcards/from-selection/:docId
// @access  Private
export const flashcardFromSelection = async (req, res) => {
  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');
  ensureReady(document);

  const sources = await retrieveChunks({ documentIds: [document._id], query: req.body.text, k: 2 });
  const context = [req.body.text, ...sources.map((s) => s.text)].join('\n\n');
  const generated = await aiGenerateFlashcards({ source: { text: context }, count: 1, focus: `this passage: "${req.body.text.slice(0, 300)}"` });

  const [card] = toCards(generated, { user: req.user._id, document: document._id, existing: [], count: 1 });
  if (!card) throw new HttpError(502, 'The AI could not make a flashcard from that selection.');

  const flashcard = await Flashcard.create(card);
  res.status(201).json({ flashcard });
};

// @desc    Get all flashcards for a specific document
// @route   GET /api/flashcards/:docId
// @access  Private
export const getFlashcardsByDoc = async (req, res) => {
  await findOwned(Document, req.params.docId, req.user._id, 'Document');
  const flashcards = await Flashcard.find({ document: req.params.docId, user: req.user._id }).sort({ createdAt: 1 });
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

// @desc    Delete a flashcard
// @route   DELETE /api/flashcards/:id
// @access  Private
export const deleteFlashcard = async (req, res) => {
  const flashcard = await findOwned(Flashcard, req.params.id, req.user._id, 'Flashcard');
  await flashcard.deleteOne();
  res.json({ message: 'Flashcard deleted' });
};
