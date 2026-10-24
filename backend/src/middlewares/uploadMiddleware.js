import multer from 'multer';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

// Files are kept in memory so the controller can validate the bytes and extract
// text before handing them to private storage (services/storage.js).
const fileFilter = (req, file, cb) => {
  const isPdfMime =
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/x-pdf' ||
    file.mimetype === 'application/acrobat' ||
    file.mimetype === 'applications/vnd.pdf' ||
    file.mimetype === 'text/pdf';
  const isPdfExtension = (file.originalname || '').toLowerCase().endsWith('.pdf');

  if (isPdfMime || (isPdfExtension && file.mimetype === 'application/octet-stream')) {
    cb(null, true);
  } else {
    const err = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
    err.message = 'Only PDF files are allowed. Please upload a valid PDF document.';
    err.status = 400;
    err.expose = true;
    cb(err, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
    files: 1,
  },
});

/**
 * Express middleware wrapper that handles multer errors gracefully.
 * Converts MulterError into user-friendly 400 responses.
 */
export const handleUpload = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const userErr = new Error(
        err.code === 'LIMIT_FILE_SIZE'
          ? `File is too large. Maximum allowed size is ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.`
          : err.code === 'LIMIT_FILE_COUNT'
            ? 'Only one file can be uploaded at a time.'
            : err.message || 'File upload error.'
      );
      userErr.status = 400;
      userErr.expose = true;
      return next(userErr);
    }

    // fileFilter custom error or other errors
    if (err.status) return next(err);

    err.status = 400;
    err.expose = true;
    next(err);
  });
};

export default upload;
