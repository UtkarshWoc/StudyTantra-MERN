import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import ChatHistory from '../models/ChatHistory.js';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { deleteFile } from './storage.js';

// Everything that hangs off a document. Keep this list in sync when adding
// per-document collections so deletes never leave orphans.
export const deleteDocumentCascade = async (doc) => {
  await deleteFile(doc);
  await Promise.all([
    Flashcard.deleteMany({ document: doc._id }),
    Quiz.deleteMany({ document: doc._id }),
    QuizAttempt.deleteMany({ document: doc._id }),
    ChatHistory.deleteMany({ document: doc._id }),
  ]);
  await doc.deleteOne();
};

export const deleteUserCascade = async (userId) => {
  const docs = await Document.find({ user: userId });
  for (const doc of docs) {
    await deleteDocumentCascade(doc);
  }
  await Promise.all([
    Flashcard.deleteMany({ user: userId }),
    Quiz.deleteMany({ user: userId }),
    QuizAttempt.deleteMany({ user: userId }),
    ChatHistory.deleteMany({ user: userId }),
    Session.deleteMany({ user: userId }),
  ]);
  await User.deleteOne({ _id: userId });
};
