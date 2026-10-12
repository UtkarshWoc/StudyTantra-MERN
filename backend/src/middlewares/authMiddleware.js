import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { unauthorized } from '../utils/httpError.js';

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw unauthorized('Not authorized, no token');
  }

  let decoded;
  try {
    decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET, { clockTolerance: 30 });
  } catch {
    throw unauthorized('Not authorized, token failed');
  }

  req.user = await User.findById(decoded.userId).select('-password');
  if (!req.user) throw unauthorized('Not authorized, user not found');

  next();
};

export { protect };
