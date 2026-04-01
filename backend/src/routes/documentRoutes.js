import express from 'express';
import {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
} from '../controllers/documentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Allow user to upload PDF and get list of documents
router.route('/')
  .post(protect, upload.single('document'), uploadDocument)
  .get(protect, getUserDocuments);

// Single document operations
router.route('/:id')
  .get(protect, getDocumentById)
  .delete(protect, deleteDocument);

export default router;
