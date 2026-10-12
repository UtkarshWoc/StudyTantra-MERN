import { env } from '../../config/env.js';
import { geminiProvider } from './providers/gemini.js';
import { mockProvider } from './providers/mock.js';

// Single entry point for every AI call in the app. Controllers never talk to a
// provider SDK directly, so models/providers can change in one place.
export const provider = env.AI_PROVIDER === 'mock' ? mockProvider : geminiProvider;

// Rough cap on context sent per request (~100k tokens).
const MAX_CONTEXT_CHARS = 400_000;

const BASE_SYSTEM = `You are StudyTantra, an expert study assistant for students.
Be accurate and grounded in the provided material. If the material does not contain the answer, say so.`;

/**
 * A "source" is what the AI reads: either the raw PDF ({ pdf: Buffer }) or
 * extracted text ({ text: string }). Returns content parts for the provider.
 */
const sourceParts = (source) => {
  if (source?.pdf) {
    return [{ inlineData: { data: source.pdf.toString('base64'), mimeType: 'application/pdf' } }];
  }
  const text = (source?.text || '').slice(0, MAX_CONTEXT_CHARS);
  return [{ text: `Study material:\n---\n${text}\n---` }];
};

const focusLine = (focus) => (focus ? `\nFocus only on: ${focus}.` : '');
const avoidLine = (avoid = []) =>
  avoid.length ? `\nDo NOT repeat or rephrase any of these existing questions:\n${avoid.slice(0, 100).map((q) => `- ${q}`).join('\n')}` : '';
const difficultyLine = (difficulty) =>
  difficulty && difficulty !== 'mixed' ? `\nDifficulty: ${difficulty}.` : '\nMix easy, medium and hard items.';

// ---- JSON schemas (Gemini structured output) ----

const flashcardSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      question: { type: 'string' },
      answer: { type: 'string' },
      topic: { type: 'string', description: 'Short 1-3 word category' },
    },
    required: ['question', 'answer', 'topic'],
  },
};

export const QUESTION_TYPES = ['mcq', 'true_false', 'fill_blank', 'short_answer'];

const quizSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: QUESTION_TYPES },
      question: { type: 'string' },
      options: { type: 'array', items: { type: 'string' }, description: '4 options for mcq, ["True","False"] for true_false, empty otherwise' },
      correctAnswer: { type: 'string', description: 'For mcq/true_false must exactly equal one option; for fill_blank the missing word(s); for short_answer a model answer' },
      explanation: { type: 'string' },
      topic: { type: 'string', description: 'Short 1-3 word category' },
    },
    required: ['type', 'question', 'options', 'correctAnswer', 'explanation', 'topic'],
  },
};

const gradingSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      index: { type: 'integer' },
      correct: { type: 'boolean' },
      feedback: { type: 'string', description: 'One or two sentences of feedback for the student' },
    },
    required: ['index', 'correct', 'feedback'],
  },
};

// ---- Tasks ----

export const summarize = ({ source }) =>
  provider.generateText({
    system: BASE_SYSTEM,
    parts: [
      ...sourceParts(source),
      { text: 'Write a concise, well-structured study summary of this material in Markdown: key concepts, important definitions, and how ideas connect. Use headings and bullet points.' },
    ],
  });

export const generateFlashcards = ({ source, count, focus, difficulty, avoid }) =>
  provider.generateJSON({
    system: BASE_SYSTEM,
    schema: flashcardSchema,
    parts: [
      ...sourceParts(source),
      { text: `Create exactly ${count} study flashcards for active recall from this material. Each answer should be short and self-contained.${focusLine(focus)}${difficultyLine(difficulty)}${avoidLine(avoid)}` },
    ],
    mock: { kind: 'flashcards', count },
  });

export const generateQuiz = ({ source, count, types = ['mcq'], focus, difficulty, avoid }) =>
  provider.generateJSON({
    system: BASE_SYSTEM,
    schema: quizSchema,
    parts: [
      ...sourceParts(source),
      { text: `Create a ${count}-question quiz from this material. Allowed question types: ${types.join(', ')} (spread across them).${focusLine(focus)}${difficultyLine(difficulty)}${avoidLine(avoid)}` },
    ],
    mock: { kind: 'quiz', count, types },
  });

/**
 * Grade free-text answers. items: [{ index, question, expected, answer }]
 */
export const gradeAnswers = (items) =>
  provider.generateJSON({
    system: `${BASE_SYSTEM}\nYou grade student answers fairly: accept answers that are correct in meaning even if worded differently or slightly misspelled.`,
    schema: gradingSchema,
    parts: [{ text: `Grade each answer against the expected answer:\n${JSON.stringify(items)}` }],
    mock: { kind: 'grading', items },
  });

export const embedTexts = (texts, options) => provider.embed(texts, options);

// ---- Retrieval-augmented chat ----

/**
 * Format retrieved chunks as numbered sources the model can cite.
 * sources: [{ page, pageEnd, title?, text }]
 */
const formatSources = (sources) =>
  sources
    .map((s) => {
      const pages = s.pageEnd && s.pageEnd !== s.page ? `${s.page}-${s.pageEnd}` : `${s.page}`;
      return `[p. ${pages}]${s.title ? ` (${s.title})` : ''}\n${s.text}`;
    })
    .join('\n\n---\n\n');

const chatSystem = (sources) => `${BASE_SYSTEM}
Answer the student's question using ONLY the excerpts below. Use Markdown.
Cite the page for every claim using the exact tag shown before each excerpt, e.g. [p. 12] or [p. 3-4].
If the excerpts do not contain the answer, say you couldn't find it in the document and suggest what to search for instead.

${sources.length ? `Excerpts:\n${formatSources(sources)}` : 'No excerpts were found for this question.'}`;

/**
 * Stream an answer grounded in retrieved `sources`. Yields text chunks.
 */
export const chatStream = ({ sources, history = [], message }) =>
  provider.streamText({ system: chatSystem(sources), history, parts: [{ text: message }] });

export const chatReply = ({ sources, history = [], message }) =>
  provider.generateText({ system: chatSystem(sources), history, parts: [{ text: message }] });

/**
 * Explain a passage the student highlighted, using nearby document context.
 */
export const explainSelection = ({ selection, sources, mode = 'explain' }) =>
  provider.generateText({
    system: `${BASE_SYSTEM}\nUse Markdown. Keep it under 200 words.`,
    parts: [{
      text: `${sources.length ? `Context from the document:\n${formatSources(sources)}\n\n` : ''}${
        mode === 'simplify'
          ? 'Rewrite this passage in simple words a beginner would understand, with a small example:'
          : 'Explain this passage clearly: what it means, why it matters, and one example:'
      }\n"""${selection}"""`,
    }],
  });

// ---- OCR for scanned PDFs ----

const ocrSchema = {
  type: 'object',
  properties: {
    pages: {
      type: 'array',
      items: {
        type: 'object',
        properties: { page: { type: 'integer' }, text: { type: 'string' } },
        required: ['page', 'text'],
      },
    },
  },
  required: ['pages'],
};

/**
 * Transcribe a scanned PDF page by page. Returns [{ page, text }].
 */
export const ocrPdf = async ({ pdf }) => {
  const result = await provider.generateJSON({
    system: 'You transcribe documents accurately. Preserve headings and lists as plain text. Do not summarize.',
    schema: ocrSchema,
    parts: [...sourceParts({ pdf }), { text: 'Transcribe the full text of every page of this PDF. Use 1-based page numbers.' }],
    mock: { kind: 'ocr' },
  });
  return Array.isArray(result?.pages) ? result.pages : [];
};
