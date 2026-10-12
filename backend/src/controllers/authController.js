import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { deleteUserCascade } from '../services/cascade.js';
import { badRequest, conflict, unauthorized } from '../utils/httpError.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const authResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id),
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.exists({ email })) throw conflict('An account with this email already exists');

  const user = await User.create({ name, email, password });
  res.status(201).json(authResponse(user));
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw unauthorized('Invalid email or password');
  }

  res.json(authResponse(user));
};

// @desc    Update user profile (name, email). Changing email requires the current password.
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email, currentPassword } = req.body;

  if (name) user.name = name;

  if (email && email !== user.email) {
    if (!currentPassword || !(await user.matchPassword(currentPassword))) {
      throw badRequest('Enter your current password to change your email');
    }
    if (await User.exists({ email, _id: { $ne: user._id } })) {
      throw conflict('An account with this email already exists');
    }
    user.email = email;
  }

  await user.save();
  res.json(authResponse(user));
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { currentPassword, newPassword } = req.body;

  if (!(await user.matchPassword(currentPassword))) {
    throw badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
};

// @desc    Permanently delete the account and all of its data
// @route   DELETE /api/auth/account
// @access  Private
export const deleteAccount = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!req.body.password || !(await user.matchPassword(req.body.password))) {
    throw badRequest('Password is incorrect');
  }

  await deleteUserCascade(user._id);
  res.json({ message: 'Account deleted' });
};
