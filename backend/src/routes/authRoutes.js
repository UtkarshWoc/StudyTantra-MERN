import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerUser,
  loginUser,
  googleAuth,
  refresh,
  logout,
  logoutOthers,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  changePassword,
  deleteAccount,
  updatePreferences,
} from '../controllers/authController.js';
import { preferencesSchema } from '../validators/learningSchemas.js';
import { emailRateLimit } from '../middlewares/aiRateLimit.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { isTest } from '../config/env.js';
import {
  registerSchema,
  loginSchema,
  googleSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from '../validators/authSchemas.js';

const router = express.Router();

// Tighter limit on credential endpoints to slow down password guessing / email spam
const credentialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});

router.post('/register', credentialLimiter, validate({ body: registerSchema }), registerUser);
router.post('/login', credentialLimiter, validate({ body: loginSchema }), loginUser);
router.post('/google', credentialLimiter, validate({ body: googleSchema }), googleAuth);
router.post('/forgot-password', credentialLimiter, validate({ body: forgotPasswordSchema }), forgotPassword);
router.post('/reset-password', credentialLimiter, validate({ body: resetPasswordSchema }), resetPassword);
router.post('/verify-email', validate({ body: verifyEmailSchema }), verifyEmail);

router.post('/refresh', refresh);
router.post('/logout', logout);

router.get('/me', protect, getMe);
router.post('/logout-others', protect, logoutOthers);
router.post('/resend-verification', protect, emailRateLimit, resendVerification);
router.put('/profile', protect, emailRateLimit, validate({ body: updateProfileSchema }), updateUserProfile);
router.put('/preferences', protect, validate({ body: preferencesSchema }), updatePreferences);
router.put('/password', protect, validate({ body: changePasswordSchema }), changePassword);
router.delete('/account', protect, validate({ body: deleteAccountSchema }), deleteAccount);

export default router;
