import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Please enter a valid email address').max(254);
const password = z.string().min(8, 'Password must be at least 8 characters').max(128);
const name = z.string().trim().min(1, 'Name is required').max(80);
const token = z.string().trim().min(10, 'Invalid or missing token').max(200);

export const registerSchema = z.object({ name, email, password });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required').max(128),
});

export const googleSchema = z.object({
  credential: z.string().min(10, 'Missing Google credential').max(5000),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({ token, password });

export const verifyEmailSchema = z.object({ token });

export const updateProfileSchema = z.object({
  name: name.optional(),
  email: email.optional(),
  // Required when changing email (checked in the controller)
  currentPassword: z.string().max(128).optional(),
});

export const changePasswordSchema = z.object({
  // Optional for Google-only accounts setting a first password
  currentPassword: z.string().max(128).optional(),
  newPassword: password,
});

export const deleteAccountSchema = z.object({
  password: z.string().max(128).optional(),
  confirm: z.literal('DELETE', { errorMap: () => ({ message: 'Type DELETE to confirm' }) }),
});
