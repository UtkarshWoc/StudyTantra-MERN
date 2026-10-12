import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  // Optional for accounts created with Google sign-in
  password: {
    type: String,
  },
  googleId: {
    type: String,
    index: { unique: true, sparse: true },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  // Requested new email; replaces `email` only after it is verified
  pendingEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },
  emailVerificationTokenHash: String,
  emailVerificationExpires: Date,
  passwordResetTokenHash: String,
  passwordResetExpires: Date,
  // Bumped on password change/reset; access tokens carrying an older version are rejected.
  tokenVersion: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password || !enteredPassword) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Fields that are safe to send to the client
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    emailVerified: this.emailVerified,
    pendingEmail: this.pendingEmail || null,
    hasPassword: Boolean(this.password),
    googleLinked: Boolean(this.googleId),
    createdAt: this.createdAt,
  };
};

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
