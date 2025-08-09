import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { emitToUser } from '../config/io.js';

export const getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username.toLowerCase() })
    .select('-passwordHash')
    .populate('followers', 'username avatarUrl')
    .populate('following', 'username avatarUrl');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

export const follow = asyncHandler(async (req, res) => {
  const targetId = req.params.userId;
  if (targetId === req.user._id.toString()) return res.status(400).json({ message: 'Cannot follow yourself' });

  const target = await User.findById(targetId);
  if (!target) return res.status(404).json({ message: 'User not found' });

  const isFollowing = req.user.following.some((id) => id.toString() === targetId);
  if (isFollowing) return res.status(400).json({ message: 'Already following' });

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: target._id } });
  await User.findByIdAndUpdate(target._id, { $addToSet: { followers: req.user._id } });
  emitToUser(target._id.toString(), 'notification', { type: 'follow', fromUserId: req.user._id.toString() });
  res.json({ success: true });
});

export const unfollow = asyncHandler(async (req, res) => {
  const targetId = req.params.userId;
  const target = await User.findById(targetId);
  if (!target) return res.status(404).json({ message: 'User not found' });

  await User.findByIdAndUpdate(req.user._id, { $pull: { following: target._id } });
  await User.findByIdAndUpdate(target._id, { $pull: { followers: req.user._id } });
  res.json({ success: true });
});

export const searchUsers = asyncHandler(async (req, res) => {
  const { q = '' } = req.query;
  const users = await User.find({ username: { $regex: q, $options: 'i' } })
    .limit(10)
    .select('username avatarUrl bio');
  res.json({ users });
});

export const togglePrivacy = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.isPrivate = !user.isPrivate;
  await user.save();
  res.json({ isPrivate: user.isPrivate });
});

export const suggestions = asyncHandler(async (req, res) => {
  const myFollowing = await User.findById(req.user._id).select('following').lean();
  const suggestions = await User.aggregate([
    { $match: { _id: { $nin: [req.user._id, ...myFollowing.following] } } },
    { $project: { username: 1, avatarUrl: 1, followers: 1 } },
    { $addFields: { followersCount: { $size: '$followers' } } },
    { $sort: { followersCount: -1 } },
    { $limit: 10 },
  ]);
  res.json({ users: suggestions });
});