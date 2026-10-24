import crypto from 'crypto';

// Opaque random tokens (refresh, password reset, email verification). Only the
// SHA-256 hash is stored, so a database leak doesn't expose usable tokens.
export const randomToken = () => crypto.randomBytes(32).toString('base64url');
export const hashToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');
