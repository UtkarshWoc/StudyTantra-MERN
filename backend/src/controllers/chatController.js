import Document from '../models/Document.js';
import ChatHistory from '../models/ChatHistory.js';
import { chatWithDocumentPdf } from '../utils/geminiAI.js';
import { readFile } from '../services/storage.js';
import { findOwned } from '../utils/ownership.js';
import { badRequest, HttpError } from '../utils/httpError.js';

const MAX_MESSAGE_LENGTH = 4000;

// @desc    Send a message in the document chat
// @route   POST /api/chat/:docId
// @access  Private
export const sendChatMessage = async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) throw badRequest('Message text is required');
  if (message.length > MAX_MESSAGE_LENGTH) throw badRequest(`Message must be under ${MAX_MESSAGE_LENGTH} characters`);

  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');

  let chatHistory = await ChatHistory.findOne({ document: document._id, user: req.user._id });
  if (!chatHistory) {
    chatHistory = new ChatHistory({ document: document._id, user: req.user._id, history: [] });
  }

  const formattedHistory = chatHistory.history.map((msg) => ({
    role: msg.role === 'model' ? 'model' : 'user',
    content: msg.content,
  }));

  const pdfBuffer = await readFile(document);

  let aiResponse;
  try {
    aiResponse = await chatWithDocumentPdf(pdfBuffer, formattedHistory, message);
  } catch (aiError) {
    console.error('Gemini AI Error (will retry with empty history):', aiError.message);
    // A corrupted history is the usual cause; retry once without it.
    try {
      aiResponse = await chatWithDocumentPdf(pdfBuffer, [], message);
      chatHistory.history = [];
    } catch (retryError) {
      console.error('Gemini AI Retry Error:', retryError.message);
      throw new HttpError(502, 'The AI service is unavailable right now. Please try again.');
    }
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
