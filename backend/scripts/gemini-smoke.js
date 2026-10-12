// Manual smoke test of the real Gemini provider (uses GEMINI_API_KEY from .env).
// Makes a handful of tiny requests; does not touch the database.
//   node scripts/gemini-smoke.js
process.env.AI_PROVIDER = 'gemini';
process.env.LOG_LEVEL ??= 'warn';

const { embedTexts, generateFlashcards, generateQuiz, chatStream, gradeAnswers } = await import('../src/services/ai/index.js');

const material = 'Photosynthesis is the process by which green plants use sunlight, water and carbon dioxide to make glucose and release oxygen. It happens in chloroplasts, which contain chlorophyll.';

const vectors = await embedTexts([material, 'What do plants release during photosynthesis?'], { taskType: 'RETRIEVAL_DOCUMENT' });
console.log('embeddings:', vectors.length, 'x', vectors[0]?.length);

const cards = await generateFlashcards({ source: { text: material }, count: 2 });
console.log('flashcards:', JSON.stringify(cards));

const quiz = await generateQuiz({ source: { text: material }, count: 2, types: ['mcq', 'short_answer'] });
console.log('quiz:', JSON.stringify(quiz));

const graded = await gradeAnswers([{ index: 0, question: 'What gas do plants release?', expected: 'Oxygen', answer: 'they give off O2' }]);
console.log('grading:', JSON.stringify(graded));

let streamed = '';
for await (const text of chatStream({ sources: [{ page: 1, text: material }], message: 'Where does photosynthesis happen?' })) streamed += text;
console.log('chat:', streamed);
