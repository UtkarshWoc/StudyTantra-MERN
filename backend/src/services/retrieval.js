import mongoose from 'mongoose';
import Chunk from '../models/Chunk.js';
import { embedTexts } from './ai/index.js';
import { env } from '../config/env.js';

export const cosineSimilarity = (a, b) => {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
};

// Brute-force scoring in the app: fine for per-user document sets (a 300-page
// book is a few hundred chunks). Set VECTOR_SEARCH=atlas once an Atlas Vector
// Search index named "chunk_embeddings" exists on chunks.embedding.
const searchInApp = async ({ documentIds, queryVector, k }) => {
  const chunks = await Chunk.find({ document: { $in: documentIds } }).select('document index page pageEnd text embedding').lean();
  return chunks
    .filter((c) => c.embedding?.length)
    .map(({ embedding, ...c }) => ({ ...c, score: cosineSimilarity(queryVector, embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
};

const searchAtlas = ({ documentIds, queryVector, k }) =>
  Chunk.aggregate([
    {
      $vectorSearch: {
        index: 'chunk_embeddings',
        path: 'embedding',
        queryVector,
        numCandidates: k * 20,
        limit: k,
        filter: { document: { $in: documentIds.map((id) => new mongoose.Types.ObjectId(String(id))) } },
      },
    },
    { $project: { document: 1, index: 1, page: 1, pageEnd: 1, text: 1, score: { $meta: 'vectorSearchScore' } } },
  ]);

/**
 * Most relevant chunks for `query` across the given documents, ordered by relevance.
 */
export const retrieveChunks = async ({ documentIds, query, k = 6 }) => {
  if (!documentIds.length || !query?.trim()) return [];
  const [queryVector] = await embedTexts([query], { taskType: 'RETRIEVAL_QUERY' });
  if (!queryVector?.length) return [];
  return env.VECTOR_SEARCH === 'atlas'
    ? searchAtlas({ documentIds, queryVector, k })
    : searchInApp({ documentIds, queryVector, k });
};
