import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Export an instance of the Google Gemini SDK
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
