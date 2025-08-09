import { asyncHandler } from '../utils/asyncHandler.js';
import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';

export const createReport = asyncHandler(async (req, res) => {
  const { type, postId, commentId, userId, reason } = req.body;
  if (!type) return res.status(400).json({ message: 'type required' });
  const report = await Report.create({ reporter: req.user._id, type, post: postId, commentId, user: userId, reason });
  res.status(201).json({ report });
});

export const listReports = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id);
  if (!me.isAdmin) return res.status(403).json({ message: 'forbidden' });
  const items = await Report.find().sort({ createdAt: -1 }).limit(200);
  res.json({ items });
});

export const updateReport = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id);
  if (!me.isAdmin) return res.status(403).json({ message: 'forbidden' });
  const { status, action } = req.body;
  const rep = await Report.findByIdAndUpdate(req.params.id, { status, action }, { new: true });
  res.json({ report: rep });
});

export const adminStats = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id);
  if (!me.isAdmin) return res.status(403).json({ message: 'forbidden' });
  const [users, posts, reports] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Report.countDocuments({ status: 'open' }),
  ]);
  res.json({ counts: { users, posts, openReports: reports } });
});