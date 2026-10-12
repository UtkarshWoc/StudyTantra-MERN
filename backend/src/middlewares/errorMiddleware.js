import { isProd } from '../config/env.js';

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  error.expose = true;
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message;
  let details = err.details;

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    details = Object.values(err.errors || {}).map((e) => e.message);
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with that value already exists';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : err.message;
  }

  const isServerError = statusCode >= 500;
  if (isServerError) {
    (req.log || console).error({ err }, 'Unhandled error');
  }

  // Never leak internal error messages (DB, SDK, stack traces) to clients for 5xx.
  const safeMessage = isServerError && !err.expose ? 'Something went wrong. Please try again.' : message;

  res.status(statusCode).json({
    message: safeMessage,
    ...(details ? { details } : {}),
    ...(!isProd && isServerError ? { debug: err.message, stack: err.stack } : {}),
  });
};

export { notFound, errorHandler };
