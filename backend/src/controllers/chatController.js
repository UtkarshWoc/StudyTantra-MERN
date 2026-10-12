import Document from '../models/Document.js';
import ChatHistory from '../models/ChatHistory.js';
import { chatReply, chatStream } from '../services/ai/index.js';
import { retrieveChunks } from '../services/retrieval.js';
import { ensureReady } from '../services/studySource.js';
import { findOwned } from '../utils/ownership.js';
import { HttpError } from '../utils/httpError.js';

// Only the most recent turns are sent back to the model.
const HISTORY_TURNS = 20;
const SOURCES_PER_ANSWER = 6;

const toCitation = (chunk) => ({
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
  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');
  ensureReady(document);

  let chatHistory = await ChatHistory.findOne({ document: document._id, user: req.user._id });
  if (!chatHistory) {
    chatHistory = new ChatHistory({ document: document._id, user: req.user._id, history: [] });
  }

  const history = chatHistory.history
    .filter((m) => m.content?.trim())
    .slice(-HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content }));
  // The model expects the conversation to start with a user turn.
  while (history[0]?.role === 'model') history.shift();

  // Include the previous question so follow-ups ("what about the second one?") retrieve well
  const lastUserTurn = [...history].reverse().find((m) => m.role === 'user')?.content || '';
  const sources = await retrieveChunks({
    documentIds: [document._id],
    query: lastUserTurn ? `${lastUserTurn}\n${message}` : message,
    k: SOURCES_PER_ANSWER,
  });

  return { message, chatHistory, history, sources, citations: sources.map(toCitation) };
};

const saveTurn = async (chatHistory, message, reply, citations) => {
  chatHistory.history.push({ role: 'user', content: message });
  chatHistory.history.push({ role: 'model', content: reply, citations });
  await chatHistory.save();
};

// @desc    Send a message in the document chat (full response)
// @route   POST /api/chat/:docId
// @access  Private
export const sendChatMessage = async (req, res) => {
  const { message, chatHistory, history, sources, citations } = await prepareChat(req);

  let reply;
  try {
    reply = await chatReply({ sources, history, message });
  } catch (err) {
    req.log?.error({ err: err.message }, 'AI chat failed');
    throw new HttpError(502, 'The AI service is unavailable right now. Please try again.');
  }

  await saveTurn(chatHistory, message, reply, citations);
  res.status(200).json({ reply, citations, history: chatHistory.history });
};

// @desc    Send a message and stream the answer as Server-Sent Events
//          events: sources {citations} → token {text}* → done {history} | error {message}
// @route   POST /api/chat/:docId/stream
// @access  Private
export const streamChatMessage = async (req, res) => {
  // Errors before streaming starts (validation, not found, still processing) are normal JSON responses.
  const { message, chatHistory, history, sources, citations } = await prepareChat(req);

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

  send('sources', { citations });

  let reply = '';
  try {
    for await (const text of chatStream({ sources, history, message })) {
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
  if (reply.trim()) await saveTurn(chatHistory, message, reply, citations);
  if (!clientGone) {
    send('done', { history: chatHistory.history });
    res.end();
  }
};

// @desc    Get chat history for a document
// @route   GET /api/chat/:docId
// @access  Private
export const getChatHistory = async (req, res) => {
  await findOwned(Document, req.params.docId, req.user._id, 'Document');
  const chatHistory = await ChatHistory.findOne({ document: req.params.docId, user: req.user._id });
  res.json({ history: chatHistory?.history || [] });
};

// @desc    Clear the conversation for a document
// @route   DELETE /api/chat/:docId
// @access  Private
export const clearChatHistory = async (req, res) => {
  await findOwned(Document, req.params.docId, req.user._id, 'Document');
  await ChatHistory.deleteOne({ document: req.params.docId, user: req.user._id });
  res.json({ history: [] });
};
