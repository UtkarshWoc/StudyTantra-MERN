import mongoose from 'mongoose';
import { notFoundError } from './httpError.js';

// Load a record that must belong to the current user. Responds 404 (not 401/403)
// for both "missing" and "someone else's" so ids can't be probed.
export const findOwned = async (Model, id, userId, label = 'Resource') => {
  if (!mongoose.isValidObjectId(id)) throw notFoundError(`${label} not found`);
  const record = await Model.findOne({ _id: id, user: userId });
  if (!record) throw notFoundError(`${label} not found`);
  return record;
};
