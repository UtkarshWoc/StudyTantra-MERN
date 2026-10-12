import Collection from '../models/Collection.js';
import Document from '../models/Document.js';
import ChatHistory from '../models/ChatHistory.js';
import Quiz from '../models/Quiz.js';
import { findOwned } from '../utils/ownership.js';
import { conflict } from '../utils/httpError.js';

const withCounts = async (userId, collections) => {
  const counts = await Document.aggregate([
    { $match: { user: userId, collectionId: { $in: collections.map((c) => c._id) } } },
    { $group: { _id: '$collectionId', count: { $sum: 1 } } },
  ]);
  const byId = new Map(counts.map((c) => [String(c._id), c.count]));
  return collections.map((c) => ({ ...c.toJSON(), documentCount: byId.get(String(c._id)) || 0 }));
};

// @route   GET /api/collections
export const listCollections = async (req, res) => {
  const collections = await Collection.find({ user: req.user._id }).sort({ name: 1 });
  res.json(await withCounts(req.user._id, collections));
};

// @route   POST /api/collections
export const createCollection = async (req, res) => {
  if (await Collection.exists({ user: req.user._id, name: req.body.name })) throw conflict('You already have a collection with that name');
  const collection = await Collection.create({ ...req.body, user: req.user._id });
  res.status(201).json({ ...collection.toJSON(), documentCount: 0 });
};

// @route   GET /api/collections/:id
export const getCollection = async (req, res) => {
  const collection = await findOwned(Collection, req.params.id, req.user._id, 'Collection');
  const documents = await Document.find({ user: req.user._id, collectionId: collection._id }).sort({ createdAt: -1 });
  res.json({ ...collection.toJSON(), documents });
};

// @route   PUT /api/collections/:id
export const updateCollection = async (req, res) => {
  const collection = await findOwned(Collection, req.params.id, req.user._id, 'Collection');
  if (req.body.name && req.body.name !== collection.name &&
      await Collection.exists({ user: req.user._id, name: req.body.name })) {
    throw conflict('You already have a collection with that name');
  }
  Object.assign(collection, req.body);
  await collection.save();
  res.json(collection);
};

// @desc    Delete a collection. Its documents are kept and simply ungrouped;
//          its chat and cross-document quizzes are removed.
// @route   DELETE /api/collections/:id
export const deleteCollection = async (req, res) => {
  const collection = await findOwned(Collection, req.params.id, req.user._id, 'Collection');
  await Promise.all([
    Document.updateMany({ user: req.user._id, collectionId: collection._id }, { collectionId: null }),
    ChatHistory.deleteMany({ user: req.user._id, collectionId: collection._id }),
    // Cross-document quizzes belong to the collection; past attempts stay for topic stats
    Quiz.deleteMany({ user: req.user._id, collectionId: collection._id }),
  ]);
  await collection.deleteOne();
  res.json({ message: 'Collection deleted' });
};
