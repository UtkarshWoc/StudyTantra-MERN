import Document from '../models/Document.js';
import Collection from '../models/Collection.js';
import ChatHistory from '../models/ChatHistory.js';
import { chatReply, chatStream } from '../services/ai/index.js';
import { retrieveChunks } from '../services/retrieval.js';
import { ensureReady } from '../services/studySource.js';
import { recordActivity } from '../services/activity.js';
import { findOwned } from '../utils/ownership.js';
import { HttpError } from '../utils/httpError.js';

// Only the most recent turns are sent back to the model.
const HISTORY_TURNS = 20;
const SOURCES_PER_ANSWER = 6;

/**
 * What a chat is about: one document (/:docId) or every processed document in
 * a collection (/collection/:collectionId). Returns the documents to search
 * and the ChatHistory filter for the conversation.
 */
const resolveTarget = async (req) => {
  if (req.params.collectionId) {
    const collection = await findOwned(Collection, req.params.collectionId, req.user._id, 'Collection');
    const documents = await Document.find({ user: req.user._id, collectionId: collection._id, status: 'ready' }).select('title');
    return { documents, filter: { user: req.user._id, collectionId: collection._id }, multi: true };
  }
  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');
  return { document, documents: [document], filter: { user: req.user._id, document: document._id }, multi: false };
};

const toCitation = (titles) => (chunk) => ({
  document: chunk.document,
  title: titles.get(String(chunk.document)),
  page: chunk.page,
  pageEnd: chunk.pageEnd,
  snippet: chunk.text.slice(0, 220),
});

/**
 * Shared setup for both chat endpoints: load the conversation, retrieve the
 * passages relevant to the question, and prepare model history.
 */
const prepareChat = async (req) => {
  const { message } = req.body;
  const target = await resolveTarget(req);
  if (target.document) ensureReady(target.document);
  if (!target.documents.length) throw new HttpError(409, 'No documents in this collection have finished processing yet.');

  const chatHistory = await ChatHistory.findOne(target.filter) || new ChatHistory({ ...target.filter, history: [] });

  const history = chatHistory.history
    .filter((m) => m.content?.trim())
    .slice(-HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content }));
  // The model expects the conversation to start with a user turn.
  while (history[0]?.role === 'model') history.shift();

  // Include the previous question so follow-ups ("what about the second one?") retrieve well
  const lastUserTurn = [...history].reverse().find((m) => m.role === 'user')?.content || '';
  const chunks = await retrieveChunks({
    documentIds: target.documents.map((d) => d._id),
    query: lastUserTurn ? `${lastUserTurn}\n${message}` : message,
    k: SOURCES_PER_ANSWER,
  });

  const titles = new Map(target.documents.map((d) => [String(d._id), d.title]));
  // Multi-document answers name the document next to each excerpt
  const sources = chunks.map((c) => ({ ...c, title: target.multi ? titles.get(String(c.document)) : undefined }));

  return { message, chatHistory, history, sources, citations: chunks.map(toCitation(titles)), target };
};

const saveTurn = async (req, { chatHistory, target }, message, reply, citations) => {
  chatHistory.history.push({ role: 'user', content: message });
  chatHistory.history.push({ role: 'model', content: reply, citations });
  await chatHistory.save();
  await recordActivity(req.user._id, 'chat', { document: target.document?._id, meta: target.multi ? { collectionId: req.params.collectionId } : undefined });
};

// @desc    Send a message (full response)
// @route   POST /api/chat/:docId  |  POST /api/chat/collection/:collectionId
// @access  Private
export const sendChatMessage = async (req, res) => {
  const ctx = await prepareChat(req);

  let reply;
  try {
    reply = await chatReply({ sources: ctx.sources, history: ctx.history, message: ctx.message });
  } catch (err) {
    req.log?.error({ err: err.message }, 'AI chat failed');
    throw new HttpError(502, 'The AI service is unavailable right now. Please try again.');
  }

  await saveTurn(req, ctx, ctx.message, reply, ctx.citations);
  res.status(200).json({ reply, citations: ctx.citations, history: ctx.chatHistory.history });
};

// @desc    Send a message and stream the answer as Server-Sent Events
//          events: sources {citations} → token {text}* → done {history} | error {message}
// @route   POST /api/chat/:docId/stream  |  POST /api/chat/collection/:collectionId/stream
// @access  Private
export const streamChatMessage = async (req, res) => {
  // Errors before streaming starts (validation, not found, still processing) are normal JSON responses.
  const ctx = await prepareChat(req);

  res.set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  let clientGone = false;
  res.on('close', () => { clientGone = true; });

  send('sources', { citations: ctx.citations });

  let reply = '';
  try {
    for await (const text of chatStream({ sources: ctx.sources, history: ctx.history, message: ctx.message })) {
      if (clientGone) break;
      reply += text;
      send('token', { text });
    }
  } catch (err) {
    req.log?.error({ err: err.message }, 'AI chat stream failed');
    if (!clientGone) send('error', { message: 'The AI service is unavailable right now. Please try again.' });
    return res.end();
  }

  // Keep partial answers if the user navigated away mid-stream
  if (reply.trim()) await saveTurn(req, ctx, ctx.message, reply, ctx.citations);
  if (!clientGone) {
    send('done', { history: ctx.chatHistory.history });
    res.end();
  }
};

// @desc    Get chat history
// @route   GET /api/chat/:docId  |  GET /api/chat/collection/:collectionId
// @access  Private
export const getChatHistory = async (req, res) => {
  const { filter } = await resolveTarget(req);
  const chatHistory = await ChatHistory.findOne(filter);
  res.json({ history: chatHistory?.history || [] });
};

// @desc    Clear the conversation
// @route   DELETE /api/chat/:docId  |  DELETE /api/chat/collection/:collectionId
// @access  Private
export const clearChatHistory = async (req, res) => {
  const { filter } = await resolveTarget(req);
  await ChatHistory.deleteOne(filter);
  res.json({ history: [] });
};
