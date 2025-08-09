import { asyncHandler } from '../utils/asyncHandler.js';
import { Collection } from '../models/Collection.js';

export const listCollections = asyncHandler(async (req, res) => {
  const items = await Collection.find({ owner: req.user._id }).sort({ updatedAt: -1 });
  res.json({ items });
});

export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'name required' });
  const col = await Collection.create({ owner: req.user._id, name, posts: [] });
  res.status(201).json({ collection: col });
});

export const renameCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  const col = await Collection.findOneAndUpdate({ _id: id, owner: req.user._id }, { name }, { new: true });
  if (!col) return res.status(404).json({ message: 'Not found' });
  res.json({ collection: col });
});

export const removeCollection = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await Collection.findOneAndDelete({ _id: id, owner: req.user._id });
  res.json({ success: true });
});

export const togglePostInCollection = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { postId } = req.body;
  const col = await Collection.findOne({ _id: id, owner: req.user._id });
  if (!col) return res.status(404).json({ message: 'Not found' });
  const exists = col.posts.map((p) => p.toString()).includes(postId);
  if (exists) col.posts = col.posts.filter((p) => p.toString() !== postId);
  else col.posts.push(postId);
  await col.save();
  res.json({ collection: col });
});