import User from '../models/User.js';
import Session from '../models/Session.js';
import { verifyAccessToken } from '../services/auth.js';
import { unauthorized } from '../utils/httpError.js';

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw unauthorized('Not authorized, no token');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(header.slice(7));
  } catch {
    throw unauthorized('Not authorized, token failed');
  }

  const [user, session] = await Promise.all([
    User.findById(decoded.userId).select('-password'),
    decoded.sid ? Session.findById(decoded.sid).select('revokedAt createdAt') : null,
  ]);
  if (!user) throw unauthorized('Not authorized, user not found');

  // Tokens die with their session (logout / "log out other devices") and with
  // any password change (tokenVersion bump).
  if (!session || session.revokedAt || (decoded.tv ?? 0) !== user.tokenVersion) {
    throw unauthorized('Session expired, please sign in again');
  }

  req.user = user;
  req.sessionId = session._id;
  req.sessionCreatedAt = session.createdAt;
  next();
};

export { protect };
