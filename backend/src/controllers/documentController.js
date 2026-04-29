import Document from '../models/Document.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Upload new document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;

    // multer-storage-cloudinary puts the Cloudinary URL in file.path
    // and the public_id in file.filename
    const document = await Document.create({
      user: req.user._id,
      title: req.body.title || file.originalname,
      filename: file.originalname || file.filename,
      filePath: file.path,                  // Cloudinary secure URL
      cloudinaryPublicId: file.filename,     // Cloudinary public_id for deletion
      sizeBytes: file.size || 0,
      pageCount: 0,                          // We no longer parse locally; page count can be set later
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Error in uploadDocument:', error);
    res.status(500).json({ message: 'Server error during file upload', error: error.message });
  }
};

// @desc    Get all documents for logged in user
// @route   GET /api/documents
// @access  Private
export const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
    // With Cloudinary, files are always available via URL — no local file checks needed
    res.json(documents);
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
      // Delete the file from Cloudinary
      if (document.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(document.cloudinaryPublicId, { resource_type: 'raw' });
        } catch (cloudErr) {
          console.warn('Cloudinary deletion warning:', cloudErr.message);
          // Continue deleting the DB record even if Cloudinary fails
        }
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
