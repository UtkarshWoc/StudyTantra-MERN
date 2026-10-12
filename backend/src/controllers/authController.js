import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { deleteUserCascade } from '../services/cascade.js';
import {
  startSession,
  rotateSession,
  revokeSessionByToken,
  revokeAllSessions,
  clearRefreshCookie,
  signAccessToken,
  REFRESH_COOKIE,
} from '../services/auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';
import { randomToken, hashToken } from '../utils/tokens.js';
import { badRequest, conflict, unauthorized, HttpError } from '../utils/httpError.js';

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

const issueVerification = async (user) => {
  const token = randomToken();
  user.emailVerificationTokenHash = hashToken(token);
  user.emailVerificationExpires = new Date(Date.now() + VERIFY_TTL_MS);
  await user.save();
  await sendVerificationEmail(user, token);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.exists({ email })) throw conflict('An account with this email already exists');

  const user = await User.create({ name, email, password });
  await issueVerification(user);
  res.status(201).json(await startSession(req, res, user));
};

// @desc    Log in with email + password
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw unauthorized('Invalid email or password');
  }

  res.json(await startSession(req, res, user));
};

// @desc    Sign in / sign up with a Google ID token (Google Identity Services)
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  if (!env.GOOGLE_CLIENT_ID) throw new HttpError(501, 'Google sign-in is not configured');

  let payload;
  try {
    const ticket = await new OAuth2Client(env.GOOGLE_CLIENT_ID).verifyIdToken({
      idToken: req.body.credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw unauthorized('Google sign-in failed');
  }
  if (!payload?.email || !payload.email_verified) throw unauthorized('Your Google email is not verified');

  const email = payload.email.toLowerCase();
  let user = await User.findOne({ googleId: payload.sub }) || await User.findOne({ email });

  if (user) {
    // Google has verified ownership of this email, so linking is safe.
    user.googleId ??= payload.sub;
    user.emailVerified = true;
    await user.save();
  } else {
    user = await User.create({ name: payload.name || email.split('@')[0], email, googleId: payload.sub, emailVerified: true });
  }

  res.json(await startSession(req, res, user));
};

// @desc    Get a new access token using the refresh cookie (rotates the cookie)
// @route   POST /api/auth/refresh
// @access  Public (refresh cookie)
export const refresh = async (req, res) => {
  const result = await rotateSession(req, res, req.cookies?.[REFRESH_COOKIE]);
  if (!result) {
    clearRefreshCookie(res);
    throw unauthorized('Session expired, please sign in again');
  }
  res.json(result);
};

// @desc    Log out this device
// @route   POST /api/auth/logout
// @access  Public (refresh cookie)
export const logout = async (req, res) => {
  await revokeSessionByToken(req.cookies?.[REFRESH_COOKIE]);
  clearRefreshCookie(res);
  res.json({ message: 'Logged out' });
};

// @desc    Log out every other device
// @route   POST /api/auth/logout-others
// @access  Private
export const logoutOthers = async (req, res) => {
  const result = await revokeAllSessions(req.user._id, { except: req.sessionId });
  res.json({ message: 'Other sessions signed out', count: result.modifiedCount });
};

// @desc    Current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user: user.toPublicJSON() });
};

// @desc    Verify email with the emailed token
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  const user = await User.findOne({
    emailVerificationTokenHash: hashToken(req.body.token),
    emailVerificationExpires: { $gt: new Date() },
  });
  if (!user) throw badRequest('This verification link is invalid or has expired');

  user.emailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  res.json({ message: 'Email verified', user: user.toPublicJSON() });
};

// @desc    Resend the verification email
// @route   POST /api/auth/resend-verification
// @access  Private
export const resendVerification = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.emailVerified) return res.json({ message: 'Email already verified' });
  await issueVerification(user);
  res.json({ message: 'Verification email sent' });
};

// @desc    Start a password reset. Always responds the same so emails cannot be enumerated.
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = randomToken();
    user.passwordResetTokenHash = hashToken(token);
    user.passwordResetExpires = new Date(Date.now() + RESET_TTL_MS);
    await user.save();
    await sendPasswordResetEmail(user, token);
  }
  res.json({ message: 'If an account exists for that email, a reset link has been sent.' });
};

// @desc    Set a new password with a reset token; signs out every device
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const user = await User.findOne({
    passwordResetTokenHash: hashToken(req.body.token),
    passwordResetExpires: { $gt: new Date() },
  });
  if (!user) throw badRequest('This reset link is invalid or has expired');

  user.password = req.body.password;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  // Clicking the emailed link proves ownership of the address
  user.emailVerified = true;
  user.tokenVersion += 1;
  await user.save();
  await revokeAllSessions(user._id);

  res.json({ message: 'Password updated. Please sign in.' });
};

// @desc    Update user profile (name, email). Changing email requires the current password.
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email, currentPassword } = req.body;

  if (name) user.name = name;

  if (email && email !== user.email) {
    if (!(await user.matchPassword(currentPassword))) {
      throw badRequest(user.password ? 'Enter your current password to change your email' : 'Set a password before changing your email');
    }
    if (await User.exists({ email, _id: { $ne: user._id } })) {
      throw conflict('An account with this email already exists');
    }
    user.email = email;
    user.emailVerified = false;
    await issueVerification(user);
  }

  await user.save();
  res.json({ user: user.toPublicJSON() });
};

// @desc    Change (or, for Google-only accounts, set) the password. Signs out other devices.
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { currentPassword, newPassword } = req.body;

  if (user.password && !(await user.matchPassword(currentPassword))) {
    throw badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  user.tokenVersion += 1;
  await user.save();
  await revokeAllSessions(user._id, { except: req.sessionId });

  // Old access tokens are now invalid; hand this device a fresh one.
  res.json({ message: 'Password updated', user: user.toPublicJSON(), accessToken: signAccessToken(user, req.sessionId) });
};

// @desc    Permanently delete the account and all of its data
// @route   DELETE /api/auth/account
// @access  Private
export const deleteAccount = async (req, res) => {
  const user = await User.findById(req.user._id);

  // Password-less (Google-only) accounts confirm with the typed "DELETE" alone.
  if (user.password && !(await user.matchPassword(req.body.password))) {
    throw badRequest('Password is incorrect');
  }

  await deleteUserCascade(user._id);
  clearRefreshCookie(res);
  res.json({ message: 'Account deleted' });
};
