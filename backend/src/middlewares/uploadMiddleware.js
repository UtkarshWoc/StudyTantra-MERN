import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Configure Cloudinary storage for multer
// Files are uploaded directly to Cloudinary instead of local disk
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'studytantra_documents', // Cloudinary folder name
    resource_type: 'raw',            // 'raw' for non-image files like PDFs
    allowed_formats: ['pdf'],
    // Use a unique public_id to avoid collisions
    public_id: (req, file) => `doc-${Date.now()}-${file.originalname.replace(/\.[^.]+$/, '')}`,
  },
});

// File filter (Only allow PDFs)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  }
});

export default upload;
