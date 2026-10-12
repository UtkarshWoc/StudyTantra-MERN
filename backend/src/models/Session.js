import mongoose from 'mongoose';

// A refresh-token session (one per signed-in device). The refresh token itself
// lives only in an httpOnly cookie; we store its hash and rotate it on every refresh.
const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  tokenHash: { type: String, required: true, unique: true },
  // Hash of the token this one replaced, kept to detect replay of a rotated-out token
  previousTokenHash: { type: String, index: true },
  rotatedAt: { type: Date },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date },
  lastUsedAt: { type: Date, default: Date.now },
  userAgent: { type: String },
  ip: { type: String },
}, {
  timestamps: true,
});

sessionSchema.index({ user: 1 });
// MongoDB removes expired sessions automatically
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
