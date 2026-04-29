import Document from '../models/Document.js';
import ChatHistory from '../models/ChatHistory.js';
import { chatWithDocumentUrl } from '../utils/geminiAI.js';

// @desc    Send a message in the document chat
// @route   POST /api/chat/:docId
// @access  Private
export const sendChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const document = await Document.findById(req.params.docId);

    if (!document || document.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Document not found or unauthorized' });
    }

    if (!document.filePath) {
      return res.status(404).json({ message: 'Document file URL missing' });
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ document: req.params.docId, user: req.user._id });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        document: req.params.docId,
        user: req.user._id,
        history: []
      });
    }

    // Format history for Gemini API
    // Gemini expects 'user' and 'model' roles. We map our history to that.
    const formattedHistory = chatHistory.history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      content: msg.content
    }));

    // Call Gemini — fetches PDF from Cloudinary URL, extracts text, then chats
    let aiResponse;
    try {
      aiResponse = await chatWithDocumentUrl(document.filePath, formattedHistory, message);
    } catch (aiError) {
      console.error('Gemini AI Error (will retry with empty history):', aiError.message);
      // If it fails, likely corrupted history. Clear it and retry with no history.
      try {
        aiResponse = await chatWithDocumentUrl(document.filePath, [], message);
        // Reset the stored history since it was causing problems
        chatHistory.history = [];
      } catch (retryError) {
        console.error('Gemini AI Retry Error:', retryError.message);
        return res.status(500).json({ message: 'AI service error. Please check your Gemini API key and try again.', error: retryError.message });
      }
    }

    // Append to history and save
    chatHistory.history.push({ role: 'user', content: message });
    chatHistory.history.push({ role: 'model', content: aiResponse });
    
    await chatHistory.save();

    res.status(200).json({ reply: aiResponse, history: chatHistory.history });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ message: 'Server error processing chat', error: error.message });
  }
};

// @desc    Get chat history for a document
// @route   GET /api/chat/:docId
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ document: req.params.docId, user: req.user._id });
    
    if (!chatHistory) {
      return res.json({ history: [] }); // Empty history is okay
    }
    
    res.json({ history: chatHistory.history });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error fetching chat history' });
  }
};
