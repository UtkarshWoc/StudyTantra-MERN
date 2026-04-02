import fs from 'fs';
import path from 'path';
import Document from '../models/Document.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// @desc    Upload new document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;

    // Read the PDF to get page count (optional, but requested in model)
    let pageCount = 0;
    try {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      pageCount = pdfData.numpages || 0;
    } catch (parseError) {
      console.warn('PDF Parse Warning (Skipping page count):', parseError.message);
    }

    const document = await Document.create({
      user: req.user._id,
      title: req.body.title || file.originalname,
      filename: file.filename,
      filePath: file.path,
      sizeBytes: file.size,
      pageCount: pageCount,
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Error in uploadDocument:', error);
    try { fs.writeFileSync('upload_error.log', error.stack || error.message); } catch(e){}
    res.status(500).json({ message: 'Server error during file upload', error: error.message });
  }
};

// @desc    Get all documents for logged in user
// @route   GET /api/documents
// @access  Private
export const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Check if files actually exist on disk, filter and cleanup if corrupted
    const validDocuments = [];
    for (const doc of documents) {
      try {
        if (doc.filePath && fs.existsSync(doc.filePath)) {
          validDocuments.push(doc);
        } else {
          // Orphaned record found, clean it up from DB
          console.warn(`Cleaning up orphaned document record (File missing or no path): ${doc.title}`);
          await Document.deleteOne({ _id: doc._id });
        }
      } catch (checkErr) {
        console.error(`Error checking file for doc ${doc._id}:`, checkErr);
        validDocuments.push(doc); // push anyway to avoid breaking the whole list
      }
    }

    res.json(validDocuments);
  } catch (error) {
    console.error('Error in getUserDocuments:', error);
    res.status(500).json({ message: 'Server error retrieving documents', error: error.message });
  }
};

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Private
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (document && document.user.toString() === req.user._id.toString()) {
      res.json(document);
    } else {
      res.status(404).json({ message: 'Document not found or unauthorized' });
    }
  } catch (error) {
    console.error('Error in getDocumentById:', error);
    res.status(500).json({ message: 'Server error retrieving document' });
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (document && document.user.toString() === req.user._id.toString()) {
      // Delete the file from the uploads directory
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }

      await document.deleteOne();
      res.json({ message: 'Document removed' });
    } else {
      res.status(404).json({ message: 'Document not found or unauthorized' });
    }
  } catch (error) {
    console.error('Error in deleteDocument:', error);
    res.status(500).json({ message: 'Server error deleting document' });
  }
};

// @desc    Toggle favorite status of a document
// @route   PUT /api/documents/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (document && document.user.toString() === req.user._id.toString()) {
      document.isFavorited = !document.isFavorited;
      await document.save();
      res.json(document);
    } else {
      res.status(404).json({ message: 'Document not found or unauthorized' });
    }
  } catch (error) {
    console.error('Error in toggleFavorite:', error);
    res.status(500).json({ message: 'Server error toggling favorite status' });
  }
};
