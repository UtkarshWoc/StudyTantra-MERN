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
const RECENT_LOGIN_MS = 15 * 60 * 1000;

// Sends a verification link to the address being proven: a pending email
// change if there is one, otherwise the account's current email.
const issueVerification = async (user) => {
  const token = randomToken();
  user.emailVerificationTokenHash = hashToken(token);
  user.emailVerificationExpires = new Date(Date.now() + VERIFY_TTL_MS);
  await user.save();
  await sendVerificationEmail(user, token, user.pendingEmail || user.email);
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

  // 1. This Google identity is already linked to an account: sign in to it.
  let user = await User.findOne({ googleId: payload.sub });

  if (!user) {
    const existing = await User.findOne({ email });

    if (existing?.emailVerified) {
      // 2. A verified account owns this email. Link it, unless it is already
      //    linked to a different Google identity.
      if (existing.googleId && existing.googleId !== payload.sub) {
        throw conflict('This email is linked to a different Google account');
      }
      existing.googleId = payload.sub;
      await existing.save();
      user = existing;
    } else {
      if (existing) {
        // 3. Someone claimed this email without ever proving ownership (a
        //    possible pre-hijack). Never merge into that account: release the
        //    address from it and give the real owner a fresh account.
        existing.email = `unclaimed+${existing._id}@invalid.studytantra`;
        existing.emailVerificationTokenHash = undefined;
        existing.emailVerificationExpires = undefined;
        existing.passwordResetTokenHash = undefined;
        existing.passwordResetExpires = undefined;
        await existing.save();
      }
      user = await User.create({ name: payload.name || email.split('@')[0], email, googleId: payload.sub, emailVerified: true });
    }
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

  if (user.pendingEmail) {
    // An email change only takes effect once the new address is proven.
    if (await User.exists({ email: user.pendingEmail, _id: { $ne: user._id } })) {
      throw conflict('An account with this email already exists');
    }
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    // Reset links sent to the old address must stop working
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
  }
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
  if (user.emailVerified && !user.pendingEmail) return res.json({ message: 'Email already verified' });
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

  if (!user.emailVerified) {
    // The reset proves control of an address this account never verified; a
    // Google identity linked by whoever created it can't be trusted.
    user.googleId = undefined;
  }
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

// @desc    Update name, or request an email change. The new email only replaces
//          the current one after it is verified, and requires the current password.
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email, currentPassword } = req.body;
  let message = 'Profile updated';

  if (name) user.name = name;

  if (email && email !== user.email) {
    if (!(await user.matchPassword(currentPassword))) {
      throw badRequest(user.password ? 'Enter your current password to change your email' : 'Use "Forgot password" to set a password before changing your email');
    }
    if (await User.exists({ email, _id: { $ne: user._id } })) {
      throw conflict('An account with this email already exists');
    }
    user.pendingEmail = email;
    await issueVerification(user);
    message = `We sent a confirmation link to ${email}. Your email changes once you open it.`;
  }

  await user.save();
  res.json({ message, user: user.toPublicJSON() });
};

// @desc    Change the password. Signs out other devices.
//          Google-only accounts set their first password via the emailed reset link,
//          so a stolen access token alone can never add a password login.
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { currentPassword, newPassword } = req.body;

  if (!user.password) {
    throw badRequest('Your account uses Google sign-in. Use "Forgot password" to set a password.');
  }
  if (!(await user.matchPassword(currentPassword))) {
    throw badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  user.tokenVersion += 1;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
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

  if (user.password) {
    if (!(await user.matchPassword(req.body.password))) throw badRequest('Password is incorrect');
  } else if (Date.now() - req.sessionCreatedAt.getTime() > RECENT_LOGIN_MS) {
    // Password-less (Google-only) accounts prove presence with a fresh sign-in instead.
    throw new HttpError(403, 'Please sign out and sign in again with Google, then delete your account.');
  }

  await deleteUserCascade(user._id);
  clearRefreshCookie(res);
  res.json({ message: 'Account deleted' });
};
