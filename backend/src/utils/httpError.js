// Error carrying an HTTP status. Thrown from controllers/services and turned
// into a JSON response by errorHandler. `expose` messages are safe to show users.
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
    this.expose = status < 500;
  }
}

export const badRequest = (msg = 'Bad request', details) => new HttpError(400, msg, details);
export const unauthorized = (msg = 'Not authorized') => new HttpError(401, msg);
export const forbidden = (msg = 'Forbidden') => new HttpError(403, msg);
export const notFoundError = (msg = 'Not found') => new HttpError(404, msg);
export const conflict = (msg = 'Conflict') => new HttpError(409, msg);
