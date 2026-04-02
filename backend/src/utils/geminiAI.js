import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash — the latest fast model with generous free-tier limits
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generate a summary from the provided document text
 */
export const generateDocumentSummary = async (documentText) => {
  const prompt = `
    You are an expert AI study assistant. 
    Analyze the following document text and provide a concise, comprehensive summary 
    that captures the main concepts, key arguments, and important details.
    
    Document Text: 
    ${(documentText || '').substring(0, 100000)} // Truncate to avoid context limits if too large
  `;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

/**
 * Generate flashcards from the provided document text
 * Returns an array of objects: [{ question: "...", answer: "..." }]
 */
export const generateFlashcardsFromText = async (documentText, count = 10) => {
  const prompt = `
    You are an expert AI study assistant.
    Analyze the following document text and extract ${count} important concepts to create study flashcards.
    Return the output STRICTLY as a raw JSON array of objects without markdown formatting.
    Each object must have exactly three keys: "question", "answer", and "topic".
    The "topic" should be a short, 1-3 word category describing the concept (e.g. "Networking", "History").
    Example: [{"question": "What is X?", "answer": "X is Y.", "topic": "Networking"}]
    
    Document Text:
    ${(documentText || '').substring(0, 100000)}
  `;

  const result = await model.generateContent(prompt);
  let text = result.response.text();
  
  // Clean up any markdown code blocks the AI might add
  text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
  
  try {
    const flashcards = JSON.parse(text);
    return flashcards;
  } catch (error) {
    console.error("Failed to parse flashcards JSON:", text);
    throw new Error('AI returned malformed data');
  }
};

/**
 * Chat with the document context
 */
export const chatWithDocument = async (documentText, historyMessages, newMessage) => {
  // Filter out any entries with missing content or invalid roles
  const safeHistory = (historyMessages || [])
    .filter(msg => msg.content && msg.content.trim().length > 0)
    .map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

  // Gemini requires history to start with 'user' role. If it starts with 'model', drop it.
  while (safeHistory.length > 0 && safeHistory[0].role === 'model') {
    safeHistory.shift();
  }

  const chat = model.startChat({
    history: safeHistory,
  });

  const docText = (documentText || '').substring(0, 50000);
  const prompt = docText.length > 0
    ? `Context from the document:\n---\n${docText}\n---\n\nUser question: ${newMessage}\n\nAnswer the user's question based on the context provided above.`
    : `The user uploaded a document but no text could be extracted from it (it may be image-based). The user asked: ${newMessage}\n\nPlease respond helpfully.`;

  const result = await chat.sendMessage(prompt);
  return result.response.text();
};

/**
 * Generate quiz questions from document text
 */
export const generateQuizFromText = async (documentText, count = 5) => {
  const prompt = `
    You are an expert AI study assistant.
    Create a ${count}-question multiple-choice quiz based on the following document text.
    Return the output STRICTLY as a raw JSON array of objects without markdown formatting.
    Each object must have exactly four keys: "question", "options" (array of 4 strings), "correctAnswer" (must be one of the options), and "explanation".
    
    Document Text:
    ${(documentText || '').substring(0, 100000)}
  `;

  const result = await model.generateContent(prompt);
  let text = result.response.text();
  
  // Clean up any markdown code blocks the AI might add
  text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse quiz JSON:", text);
    throw new Error('AI returned malformed data');
  }
};
