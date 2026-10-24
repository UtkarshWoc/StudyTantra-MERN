import express from 'express';
import {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
  toggleFavorite,
  getDocumentFile,
  reprocessDocument,
  updateDocument,
} from '../controllers/documentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { handleUpload } from '../middlewares/uploadMiddleware.js';
import { aiRateLimit } from '../middlewares/aiRateLimit.js';
import { validate } from '../middlewares/validate.js';
import { documentUpdateSchema } from '../validators/learningSchemas.js';

const router = express.Router();

// Allow user to upload PDF and get list of documents
router.route('/')
  .post(protect, aiRateLimit, handleUpload('document'), uploadDocument)
  .get(protect, getUserDocuments);

// Single document operations
router.route('/:id')
  .get(protect, getDocumentById)
  .patch(protect, validate({ body: documentUpdateSchema }), updateDocument)
  .delete(protect, deleteDocument);

router.get('/:id/file', protect, getDocumentFile);
router.post('/:id/reprocess', protect, aiRateLimit, reprocessDocument);
router.put('/:id/favorite', protect, toggleFavorite);

export default router;
