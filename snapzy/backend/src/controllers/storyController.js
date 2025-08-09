import { asyncHandler } from '../utils/asyncHandler.js';
import { Story } from '../models/Story.js';

export const createStory = asyncHandler(async (req, res) => {
  const { mediaUrl, mediaType } = req.body;
  if (!mediaUrl) return res.status(400).json({ message: 'mediaUrl required' });
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const story = await Story.create({ author: req.user._id, mediaUrl, mediaType: mediaType || 'image', expiresAt });
  res.status(201).json({ story });
});

export const getStories = asyncHandler(async (req, res) => {
  const authors = req.user.following.concat([req.user._id]);
  const stories = await Story.find({ author: { $in: authors }, expiresAt: { $gt: new Date() } })
    .populate('author', 'username avatarUrl')
    .sort({ createdAt: -1 });
  res.json({ stories });
});