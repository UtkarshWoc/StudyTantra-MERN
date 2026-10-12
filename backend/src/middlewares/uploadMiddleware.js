import multer from 'multer';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

// Files are kept in memory so the controller can validate the bytes and extract
// text before handing them to private storage (services/storage.js).
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    const err = new Error('Only PDF files are allowed!');
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

export default upload;
