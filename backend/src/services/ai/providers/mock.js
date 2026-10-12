// Deterministic, offline AI provider for tests, e2e runs and local development
// without an API key (AI_PROVIDER=mock). Never allowed in production (config/env.js).

const DIMENSIONS = 64;

const tokenize = (text) => (text.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => w.length > 2);

const hash = (word) => {
  let h = 2166136261;
  for (let i = 0; i < word.length; i++) h = Math.imul(h ^ word.charCodeAt(i), 16777619);
  return Math.abs(h);
};

// Hashed bag-of-words: texts sharing words get similar vectors, so retrieval
// behaves sensibly in tests without a real embedding model.
export const mockEmbedding = (text) => {
  const v = new Array(DIMENSIONS).fill(0);
  for (const word of tokenize(text)) v[hash(word) % DIMENSIONS] += 1;
  const norm = Math.hypot(...v) || 1;
  return v.map((x) => x / norm);
};

const partsText = (parts = []) => parts.map((p) => p.text || '').join('\n');

const fixtures = {
  flashcards: ({ count }) => Array.from({ length: count }, (_, i) => ({
    question: `Mock question ${i + 1}?`,
    answer: `Mock answer ${i + 1}.`,
    topic: i % 2 ? 'Basics' : 'Advanced',
  })),
  quiz: ({ count, types = ['mcq'] }) => Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const topic = i % 2 ? 'Basics' : 'Advanced';
    if (type === 'true_false') {
      return { type, question: `Mock statement ${i + 1} is true.`, options: ['True', 'False'], correctAnswer: 'True', explanation: 'Mock explanation.', topic };
    }
    if (type === 'fill_blank' || type === 'short_answer') {
      return { type, question: `Mock prompt ${i + 1}: the answer is ____.`, options: [], correctAnswer: 'answer', explanation: 'Mock explanation.', topic };
    }
    return { type: 'mcq', question: `Mock question ${i + 1}?`, options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', explanation: 'Mock explanation.', topic };
  }),
  grading: ({ items }) => items.map((item) => ({
    index: item.index,
    correct: item.answer.trim().toLowerCase().includes(String(item.expected).trim().toLowerCase()),
    feedback: 'Mock feedback.',
  })),
  ocr: () => ({ pages: [{ page: 1, text: 'Mock OCR text.' }] }),
  plan: ({ days }) => ({
    days: days.map((date, i) => ({
      date,
      tasks: [{ type: i % 2 ? 'quiz' : 'review', title: `Mock task ${i + 1}`, description: 'Mock description.', topic: 'Basics', minutes: 30 }],
    })),
  }),
};

export const mockProvider = {
  name: 'mock',

  async generateText({ parts }) {
    const text = partsText(parts);
    return `Mock response. ${text.includes('[p.') ? 'See [p. 1].' : ''}`.trim();
  },

  async *streamText(args) {
    const text = await this.generateText(args);
    for (const word of text.split(/(?<= )/)) yield word;
  },

  async generateJSON({ mock }) {
    const fixture = fixtures[mock?.kind];
    if (!fixture) throw new Error(`No mock fixture for "${mock?.kind}"`);
    return fixture(mock);
  },

  async embed(texts) {
    return texts.map(mockEmbedding);
  },
};
