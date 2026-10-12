import Document from '../models/Document.js';
import ChatHistory from '../models/ChatHistory.js';
import { chatReply } from '../services/ai/index.js';
import { readFile } from '../services/storage.js';
import { extractPdfPages, pagesToText } from '../services/pdf.js';
import { findOwned } from '../utils/ownership.js';
import { HttpError } from '../utils/httpError.js';

// Only the most recent turns are sent back to the model.
const HISTORY_TURNS = 20;

// @desc    Send a message in the document chat
// @route   POST /api/chat/:docId
// @access  Private
export const sendChatMessage = async (req, res) => {
  const { message } = req.body;
  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');

  let chatHistory = await ChatHistory.findOne({ document: document._id, user: req.user._id });
  if (!chatHistory) {
    chatHistory = new ChatHistory({ document: document._id, user: req.user._id, history: [] });
  }

  let context = '';
  try {
    context = pagesToText((await extractPdfPages(await readFile(document))).pages);
  } catch (err) {
    req.log?.warn({ err: err.message }, 'PDF text extraction failed for chat');
  }

  const history = chatHistory.history
    .filter((m) => m.content?.trim())
    .slice(-HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content }));
  // The model expects the conversation to start with a user turn.
  while (history[0]?.role === 'model') history.shift();

  let aiResponse;
  try {
    aiResponse = await chatReply({ context, history, message });
  } catch (err) {
    req.log?.error({ err: err.message }, 'AI chat failed');
    throw new HttpError(502, 'The AI service is unavailable right now. Please try again.');
  }

  chatHistory.history.push({ role: 'user', content: message });
  chatHistory.history.push({ role: 'model', content: aiResponse });
  await chatHistory.save();

  res.status(200).json({ reply: aiResponse, history: chatHistory.history });
};

// @desc    Get chat history for a document
// @route   GET /api/chat/:docId
// @access  Private
export const getChatHistory = async (req, res) => {
  await findOwned(Document, req.params.docId, req.user._id, 'Document');
  const chatHistory = await ChatHistory.findOne({ document: req.params.docId, user: req.user._id });
  res.json({ history: chatHistory?.history || [] });
};
