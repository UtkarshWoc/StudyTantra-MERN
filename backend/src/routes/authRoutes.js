import express from 'express';
import {
  registerUser,
  loginUser,
  updateUserProfile,
  changePassword,
  deleteAccount,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from '../validators/authSchemas.js';

const router = express.Router();

router.post('/register', validate({ body: registerSchema }), registerUser);
router.post('/login', validate({ body: loginSchema }), loginUser);
router.put('/profile', protect, validate({ body: updateProfileSchema }), updateUserProfile);
router.put('/password', protect, validate({ body: changePasswordSchema }), changePassword);
router.delete('/account', protect, validate({ body: deleteAccountSchema }), deleteAccount);

export default router;
