import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';
import { env, isProd } from '../config/env.js';
import { randomToken, hashToken } from '../utils/tokens.js';

export const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const REFRESH_COOKIE = 'st_rt';

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  // Frontend (Vercel) and API (Railway) are different sites in production,
  // so the cookie must be SameSite=None (which requires Secure).
  sameSite: isProd ? 'none' : 'lax',
  path: '/api/auth',
};

export const signAccessToken = (user, sessionId) =>
  jwt.sign({ userId: user._id, sid: sessionId, tv: user.tokenVersion }, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

export const verifyAccessToken = (token) => jwt.verify(token, env.JWT_SECRET, { clockTolerance: 30 });

const setRefreshCookie = (res, token) =>
  res.cookie(REFRESH_COOKIE, token, { ...cookieOptions, maxAge: REFRESH_TTL_MS });

export const clearRefreshCookie = (res) => res.clearCookie(REFRESH_COOKIE, cookieOptions);

/**
 * Start a new session for the user: sets the refresh cookie and returns the
 * JSON body every auth endpoint responds with.
 */
export const startSession = async (req, res, user) => {
  const refreshToken = randomToken();
  const session = await Session.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    userAgent: req.get('user-agent')?.slice(0, 300),
    ip: req.ip,
  });
  setRefreshCookie(res, refreshToken);
  return { user: user.toPublicJSON(), accessToken: signAccessToken(user, session._id) };
};

/**
 * Exchange a refresh token for a new access token, rotating the refresh token.
 * Returns null when the token is unknown, revoked or expired.
 */
export const rotateSession = async (req, res, refreshToken) => {
  if (!refreshToken) return null;
  const session = await Session.findOne({ tokenHash: hashToken(refreshToken) }).populate('user');
  if (!session || session.revokedAt || session.expiresAt < new Date() || !session.user) return null;

  const next = randomToken();
  session.tokenHash = hashToken(next);
  session.lastUsedAt = new Date();
  session.expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
  await session.save();

  setRefreshCookie(res, next);
  return { user: session.user.toPublicJSON(), accessToken: signAccessToken(session.user, session._id) };
};

export const revokeSessionByToken = async (refreshToken) => {
  if (!refreshToken) return;
  await Session.updateOne({ tokenHash: hashToken(refreshToken) }, { revokedAt: new Date() });
};

export const revokeAllSessions = (userId, { except } = {}) =>
  Session.updateMany(
    { user: userId, revokedAt: null, ...(except ? { _id: { $ne: except } } : {}) },
    { revokedAt: new Date() }
  );
